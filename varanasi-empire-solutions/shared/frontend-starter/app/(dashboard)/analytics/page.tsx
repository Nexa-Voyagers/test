'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const analyticsData = [
  { category: 'Hospitality', apps: 1, icon: '🏨' },
  { category: 'Religious', apps: 1, icon: '🛕' },
  { category: 'Food & Beverage', apps: 2, icon: '🍽️' },
  { category: 'Travel', apps: 1, icon: '✈️' },
  { category: 'Healthcare', apps: 2, icon: '🏥' },
  { category: 'Real Estate', apps: 1, icon: '🏠' },
  { category: 'Retail', apps: 2, icon: '💎' },
  { category: 'Education', apps: 2, icon: '🎓' },
  { category: 'Events', apps: 1, icon: '💒' },
  { category: 'Fitness', apps: 2, icon: '🏋️' },
  { category: 'Services', apps: 3, icon: '💼' },
  { category: 'Logistics', apps: 1, icon: '🚚' },
  { category: 'Finance', apps: 1, icon: '📊' },
  { category: 'Creative', apps: 1, icon: '🎨' },
  { category: 'Beauty', apps: 1, icon: '💆' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Overview of all business management systems
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">22</div>
            <p className="text-xs text-green-600 mt-1">All complete and ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Categories Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">15</div>
            <p className="text-xs text-blue-600 mt-1">Diverse industries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">100+</div>
            <p className="text-xs text-purple-600 mt-1">Across all systems</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {analyticsData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-sm">{item.category}</p>
                  <Badge variant="outline">{item.apps} app{item.apps > 1 ? 's' : ''}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Next.js 14</Badge>
                <Badge>React 18</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>Shadcn/UI</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">Backend</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Node.js</Badge>
                <Badge>Express</Badge>
                <Badge>PostgreSQL</Badge>
                <Badge>REST API</Badge>
                <Badge>JWT Auth</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
