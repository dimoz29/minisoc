"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Activity } from "lucide-react"
import { generateLogData, detectAnomalies, type LogEntry } from "@/lib/anomaly-detection"

export default function MiniSOCDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const generatedLogs = generateLogData(200)
    const analyzedLogs = detectAnomalies(generatedLogs)
    setLogs(analyzedLogs)

    setIsAnalyzing(false)
  }

  const anomalyCount = logs.filter((log) => log.anomaly === 1).length
  const normalCount = logs.filter((log) => log.anomaly === 0).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
            <Shield className="h-10 w-10 text-blue-600" />
            Mini SOC - AI Log Anomaly Detection
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            This demo simulates system logs, runs AI-based anomaly detection, and identifies suspicious entries using
            statistical analysis.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          <Button onClick={handleAnalyze} disabled={isAnalyzing} size="lg" className="bg-blue-600 hover:bg-blue-700">
            {isAnalyzing ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Logs...
              </>
            ) : (
              "Generate and Analyze Logs"
            )}
          </Button>
        </div>

        {/* Results Summary */}
        {logs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{logs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Normal Events</CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{normalCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{anomalyCount}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Table */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Detection Results
              </CardTitle>
              <CardDescription>
                Red-highlighted rows indicate detected anomalies. Click on any row for more details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Timestamp</th>
                      <th className="text-left p-3 font-semibold">Login Failures</th>
                      <th className="text-left p-3 font-semibold">Port Scans</th>
                      <th className="text-left p-3 font-semibold">CPU Load</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr
                        key={index}
                        className={`border-b hover:bg-slate-50 transition-colors ${
                          log.anomaly === 1 ? "bg-red-50 border-red-200" : ""
                        }`}
                      >
                        <td className="p-3 font-mono text-sm">{log.timestamp.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              log.login_failures > 3 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {log.login_failures.toFixed(1)}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              log.port_scans > 3 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {log.port_scans.toFixed(1)}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              log.cpu_load > 3 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {log.cpu_load.toFixed(1)}
                          </span>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant={log.anomaly === 1 ? "destructive" : "secondary"}
                            className="flex items-center gap-1 w-fit"
                          >
                            {log.anomaly === 1 ? (
                              <>
                                <AlertTriangle className="h-3 w-3" />
                                Anomaly
                              </>
                            ) : (
                              <>
                                <Shield className="h-3 w-3" />
                                Normal
                              </>
                            )}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  log.riskScore > 0.7
                                    ? "bg-red-500"
                                    : log.riskScore > 0.4
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{ width: `${log.riskScore * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-mono">{(log.riskScore * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {logs.length > 0 && (
          <div className="text-center text-sm text-slate-600">
            Detection complete. {anomalyCount} anomalies detected out of {logs.length} total log entries.
          </div>
        )}
      </div>
    </div>
  )
}
