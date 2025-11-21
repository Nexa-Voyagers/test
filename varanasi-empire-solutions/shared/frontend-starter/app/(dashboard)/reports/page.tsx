'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const reports = [
  {
    title: 'Complete Implementation Summary',
    description: 'Overview of all 22 business management systems with full implementation details',
    file: 'COMPLETE-IMPLEMENTATION-SUMMARY.md',
    status: 'Available',
  },
  {
    title: 'Backend APIs Summary',
    description: 'Comprehensive list of all API endpoints across all systems',
    file: 'BACKEND_APIS_SUMMARY.md',
    status: 'Available',
  },
  {
    title: 'Frontend Completion Summary',
    description: 'Status and features of all frontend implementations',
    file: 'FRONTEND_COMPLETION_SUMMARY.md',
    status: 'Available',
  },
  {
    title: 'Database Schema Documentation',
    description: 'Complete database schemas for all 22 systems',
    file: 'Database Schemas',
    status: 'Available',
  },
  {
    title: 'Gap Analysis Report',
    description: 'Analysis of feature gaps and improvement opportunities',
    file: 'GAP-ANALYSIS.md',
    status: 'Available',
  },
  {
    title: 'Deployment Guide',
    description: 'Step-by-step deployment instructions for all systems',
    file: 'DEPLOYMENT-GUIDE.md',
    status: 'Available',
  },
];

const systemStatus = [
  { name: 'Hotel Management', frontend: true, backend: true, database: true },
  { name: 'Temple Management', frontend: true, backend: true, database: true },
  { name: 'Restaurant POS', frontend: true, backend: true, database: true },
  { name: 'Travel Agency', frontend: true, backend: true, database: true },
  { name: 'Hospital Management', frontend: true, backend: true, database: true },
  { name: 'Real Estate', frontend: true, backend: true, database: true },
  { name: 'Pharmacy', frontend: true, backend: true, database: true },
  { name: 'Jewellery Store', frontend: true, backend: true, database: true },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Documentation and status reports for all systems
        </p>
      </div>

      {/* Available Reports */}
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <Badge variant="default" className="bg-green-600">{report.status}</Badge>
              </div>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Completion Status</CardTitle>
          <CardDescription>Quick overview of component status for each system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">System</th>
                  <th className="text-center p-3">Frontend</th>
                  <th className="text-center p-3">Backend</th>
                  <th className="text-center p-3">Database</th>
                </tr>
              </thead>
              <tbody>
                {systemStatus.map((system, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3 font-medium">{system.name}</td>
                    <td className="text-center p-3">
                      {system.frontend ? '✅' : '❌'}
                    </td>
                    <td className="text-center p-3">
                      {system.backend ? '✅' : '❌'}
                    </td>
                    <td className="text-center p-3">
                      {system.database ? '✅' : '❌'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted">
                  <td className="p-3 font-bold">+ 14 more systems</td>
                  <td className="text-center p-3">✅</td>
                  <td className="text-center p-3">✅</td>
                  <td className="text-center p-3">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
