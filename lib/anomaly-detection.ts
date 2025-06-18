export interface LogEntry {
  timestamp: Date
  login_failures: number
  port_scans: number
  cpu_load: number
  anomaly: number
  riskScore: number
}

// Simple random number generator with seed for reproducible results
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  normal(mean = 0, stdDev = 1): number {
    // Box-Muller transform for normal distribution
    const u1 = this.next()
    const u2 = this.next()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return z0 * stdDev + mean
  }
}

export function generateLogData(n = 200): LogEntry[] {
  const rng = new SeededRandom(42)
  const logs: LogEntry[] = []

  // Generate normal data
  for (let i = 0; i < n; i++) {
    logs.push({
      timestamp: new Date(Date.now() - (n - i) * 60000), // 1 minute intervals
      login_failures: Math.max(0, rng.normal(0, 1)),
      port_scans: Math.max(0, rng.normal(0, 1)),
      cpu_load: Math.max(0, rng.normal(0, 1)),
      anomaly: 0,
      riskScore: 0,
    })
  }

  // Generate anomaly data (replace some normal data)
  for (let i = 0; i < 10; i++) {
    const index = Math.floor(rng.next() * logs.length)
    logs[index] = {
      ...logs[index],
      login_failures: Math.max(0, rng.normal(6, 0.5)),
      port_scans: Math.max(0, rng.normal(6, 0.5)),
      cpu_load: Math.max(0, rng.normal(6, 0.5)),
    }
  }

  // Shuffle array
  for (let i = logs.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
    ;[logs[i], logs[j]] = [logs[j], logs[i]]
  }

  return logs
}

export function detectAnomalies(logs: LogEntry[]): LogEntry[] {
  // Calculate statistics for each feature
  const features = ["login_failures", "port_scans", "cpu_load"] as const
  const stats: Record<string, { mean: number; std: number }> = {}

  features.forEach((feature) => {
    const values = logs.map((log) => log[feature])
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const std = Math.sqrt(variance)
    stats[feature] = { mean, std }
  })

  // Simple anomaly detection using statistical thresholds
  return logs.map((log) => {
    let anomalyScore = 0
    let totalDeviation = 0

    features.forEach((feature) => {
      const value = log[feature]
      const { mean, std } = stats[feature]
      const zScore = Math.abs((value - mean) / (std || 1))

      // Consider values beyond 2.5 standard deviations as contributing to anomaly
      if (zScore > 2.5) {
        anomalyScore += zScore
      }

      totalDeviation += zScore
    })

    // Normalize risk score
    const riskScore = Math.min(totalDeviation / (features.length * 3), 1)

    return {
      ...log,
      anomaly: anomalyScore > 3 ? 1 : 0, // Threshold for anomaly classification
      riskScore,
    }
  })
}
