// components/feedback/CSVImporter.js
'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Download,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import { truncate } from '@/lib/utils';

export default function CSVImporter({ onImportComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [detectedColumns, setDetectedColumns] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a valid .csv file');
      return;
    }

    setFile(selectedFile);
    setImportResult(null);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          toast.error('The selected CSV file appears to be empty.');
          resetFile();
          return;
        }

        const headers = results.meta.fields || [];
        setDetectedColumns(headers);

        // Check if there is at least one text-like column
        const hasTextColumn = headers.some((h) =>
          /feedback|text|comment|review|message/i.test(h)
        );

        if (!hasTextColumn && headers.length > 0) {
          toast(
            `Note: Could not automatically detect a "feedbackText" column. We will use "${headers[0]}" as text.`,
            { icon: '⚠️' }
          );
        }

        setTotalRows(results.data.length);
        setPreviewData(results.data.slice(0, 5));
        toast.success(`Loaded ${results.data.length} rows from CSV`);
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        toast.error('Failed to parse CSV file: ' + error.message);
        resetFile();
      },
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const resetFile = () => {
    setFile(null);
    setPreviewData([]);
    setTotalRows(0);
    setDetectedColumns([]);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadToServer = async () => {
    if (!file) return;

    setIsImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: async (results) => {
        try {
          const res = await fetch('/api/feedback/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rows: results.data }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.error || 'Failed to import CSV');
          }

          setImportResult(data);
          toast.success(`Successfully imported ${data.importedCount} records!`);
          if (onImportComplete) {
            onImportComplete(data);
          }
        } catch (err) {
          console.error(err);
          toast.error(err.message);
        } finally {
          setIsImporting(false);
        }
      },
      error: (err) => {
        setIsImporting(false);
        toast.error('Error reading CSV data: ' + err.message);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Import Result Banner */}
      {importResult && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-emerald-950 dark:text-emerald-200">
                Import Completed Successfully!
              </h3>
              <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                {importResult.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium">
                <span className="rounded-lg bg-emerald-100/80 px-2.5 py-1 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  ✅ Imported: {importResult.importedCount}
                </span>
                {importResult.skippedCount > 0 && (
                  <span className="rounded-lg bg-amber-100/80 px-2.5 py-1 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                    ⚠️ Skipped: {importResult.skippedCount}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <Link href="/feedback">
                  <Button size="sm" icon={ArrowRight}>
                    View All Feedback
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={resetFile}>
                  Import Another File
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Upload / Drag & Drop Zone */}
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20'
              : 'border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-sm">
            <UploadCloud className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Click to upload or drag & drop a CSV file
          </h3>
          <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
            Standard CSV format with columns: <code className="text-indigo-600 dark:text-indigo-400">feedbackText</code>, <code className="text-indigo-600 dark:text-indigo-400">source</code>, <code className="text-indigo-600 dark:text-indigo-400">rating</code>, <code className="text-indigo-600 dark:text-indigo-400">submissionDate</code>
          </p>
          <span className="mt-4 inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Supports up to 1,000 rows
          </span>
        </div>
      ) : (
        /* File Selected & Preview Mode */
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {file.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {(file.size / 1024).toFixed(1)} KB • {totalRows} records found
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={resetFile}
                disabled={isImporting}
              >
                Remove
              </Button>
              <Button
                size="sm"
                onClick={handleUploadToServer}
                isLoading={isImporting}
                icon={UploadCloud}
              >
                Import {totalRows} Rows
              </Button>
            </div>
          </div>

          {/* Detected Columns */}
          <div className="flex flex-wrap items-center gap-1.5 py-1 text-xs">
            <span className="font-medium text-zinc-500 dark:text-zinc-400">
              Detected Columns:
            </span>
            {detectedColumns.map((col, idx) => (
              <span
                key={idx}
                className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {col}
              </span>
            ))}
          </div>

          {/* Preview Table */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Preview (First 5 Rows):
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400">
                  <tr>
                    <th className="px-3.5 py-2.5">#</th>
                    {detectedColumns.map((col, idx) => (
                      <th key={idx} className="px-3.5 py-2.5 capitalize">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="px-3.5 py-2.5 font-mono text-zinc-400">{idx + 1}</td>
                      {detectedColumns.map((col, cIdx) => (
                        <td
                          key={cIdx}
                          className="max-w-xs truncate px-3.5 py-2.5 text-zinc-700 dark:text-zinc-300"
                        >
                          {row[col] ? truncate(row[col], 60) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
