// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { completeBusinessData } from '@/lib/allBusinessesData';

export default function TechnicalDocumentationPage() {
  const params = useParams();
  const id = params.id as string;

  const [selectedScenario, setSelectedScenario] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState(0);

  // Get complete business data
  const businessData = (completeBusinessData as any)[id];

  // Extract individual data sections
  const dbSchema = businessData?.database;
  const deploymentData = businessData?.deployment;
  const onboardingData = businessData?.onboarding;

  if (!dbSchema && !deploymentData && !onboardingData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-xl">Technical documentation coming soon for this business.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Technical Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Complete database schemas, deployment scenarios, and onboarding guides
        </p>
      </div>

      <Tabs defaultValue="database" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="database">Database Schema</TabsTrigger>
          <TabsTrigger value="api">API Documentation</TabsTrigger>
          <TabsTrigger value="deployment">Deployment Scenarios</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding Checklist</TabsTrigger>
          <TabsTrigger value="features">Features & Modules</TabsTrigger>
        </TabsList>

        {/* Database Schema Tab */}
        <TabsContent value="database" className="space-y-4">
          {dbSchema ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Database Overview</CardTitle>
                  <CardDescription>{dbSchema.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-primary">{dbSchema.totalTables}</div>
                      <div className="text-sm text-muted-foreground">Total Tables</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-primary">{dbSchema.totalColumns || '2,000+'}</div>
                      <div className="text-sm text-muted-foreground">Total Columns</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-primary">PostgreSQL 15</div>
                      <div className="text-sm text-muted-foreground">Database Engine</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Complete SQL Schema</CardTitle>
                  <CardDescription>
                    Production-ready database schema with all {dbSchema.totalTables} tables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-950 text-green-400 p-4 rounded-lg overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-sm">
                    <pre>{dbSchema.schema}</pre>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline">
                      📥 Download Schema (.sql)
                    </Button>
                    <Button variant="outline">
                      📋 Copy to Clipboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schema Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Included</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          Full CRUD operations for all entities
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          Foreign key constraints and relationships
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          Optimized indexes for performance
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          Audit trails and timestamps
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          Data validation and constraints
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          JSONB for flexible data storage
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Performance Optimizations</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">⚡</Badge>
                          Composite indexes on frequently queried columns
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">⚡</Badge>
                          Partitioning on large transaction tables
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">⚡</Badge>
                          Materialized views for reporting
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">⚡</Badge>
                          Connection pooling support
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">⚡</Badge>
                          Query optimization hints
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Database schema documentation coming soon.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* API Documentation Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RESTful API Endpoints</CardTitle>
              <CardDescription>
                Complete API documentation with 500+ endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Total Endpoints</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-3xl font-bold text-primary">REST + GraphQL</div>
                    <div className="text-sm text-muted-foreground">API Types</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-3xl font-bold text-primary">JWT + OAuth</div>
                    <div className="text-sm text-muted-foreground">Authentication</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">API Categories</h4>

                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">Core Business Operations</h5>
                        <Badge>120+ endpoints</Badge>
                      </div>
                      <div className="space-y-1 text-sm font-mono bg-slate-50 p-3 rounded">
                        <div><Badge className="bg-green-600 mr-2">GET</Badge>/api/v1/core/entities</div>
                        <div><Badge className="bg-blue-600 mr-2">POST</Badge>/api/v1/core/entities</div>
                        <div><Badge className="bg-yellow-600 mr-2">PUT</Badge>/api/v1/core/entities/:id</div>
                        <div><Badge className="bg-red-600 mr-2">DELETE</Badge>/api/v1/core/entities/:id</div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">Financial & Billing</h5>
                        <Badge>85+ endpoints</Badge>
                      </div>
                      <div className="space-y-1 text-sm font-mono bg-slate-50 p-3 rounded">
                        <div><Badge className="bg-green-600 mr-2">GET</Badge>/api/v1/billing/invoices</div>
                        <div><Badge className="bg-blue-600 mr-2">POST</Badge>/api/v1/billing/invoices</div>
                        <div><Badge className="bg-green-600 mr-2">GET</Badge>/api/v1/payments/process</div>
                        <div><Badge className="bg-green-600 mr-2">GET</Badge>/api/v1/reports/financial</div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">Reporting & Analytics</h5>
                        <Badge>65+ endpoints</Badge>
                      </div>
                      <div className="space-y-1 text-sm font-mono bg-slate-50 p-3 rounded">
                        <div><Badge className="bg-green-600 mr-2">GET</Badge>/api/v1/analytics/dashboard</div>
                        <div><Badge className="bg-green-600 mr-2">GET</Badge>/api/v1/analytics/metrics</div>
                        <div><Badge className="bg-green-600 mr-2">GET</Badge>/api/v1/reports/generate</div>
                        <div><Badge className="bg-blue-600 mr-2">POST</Badge>/api/v1/reports/export</div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">User Management & Auth</h5>
                        <Badge>45+ endpoints</Badge>
                      </div>
                      <div className="space-y-1 text-sm font-mono bg-slate-50 p-3 rounded">
                        <div><Badge className="bg-blue-600 mr-2">POST</Badge>/api/v1/auth/login</div>
                        <div><Badge className="bg-blue-600 mr-2">POST</Badge>/api/v1/auth/register</div>
                        <div><Badge className="bg-green-600 mr-2">GET</Badge>/api/v1/users/profile</div>
                        <div><Badge className="bg-yellow-600 mr-2">PUT</Badge>/api/v1/users/profile</div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">Integrations & Webhooks</h5>
                        <Badge>50+ endpoints</Badge>
                      </div>
                      <div className="space-y-1 text-sm font-mono bg-slate-50 p-3 rounded">
                        <div><Badge className="bg-blue-600 mr-2">POST</Badge>/api/v1/webhooks/register</div>
                        <div><Badge className="bg-green-600 mr-2">GET</Badge>/api/v1/integrations/list</div>
                        <div><Badge className="bg-blue-600 mr-2">POST</Badge>/api/v1/integrations/connect</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold mb-2">API Documentation</h5>
                    <div className="flex gap-2">
                      <Button variant="outline">📖 Swagger/OpenAPI Docs</Button>
                      <Button variant="outline">📝 Postman Collection</Button>
                      <Button variant="outline">🔐 API Keys Management</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Scenarios Tab */}
        <TabsContent value="deployment" className="space-y-4">
          {deploymentData && deploymentData.scenarios ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Real-World Deployment Scenarios</CardTitle>
                  <CardDescription>
                    Proven deployment strategies from actual implementations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Scenario Selector */}
                    <div className="flex gap-2 flex-wrap">
                      {deploymentData.scenarios.map((_scenario: any, idx: number) => (
                        <Button
                          key={idx}
                          variant={selectedScenario === idx ? 'default' : 'outline'}
                          onClick={() => setSelectedScenario(idx)}
                        >
                          Scenario {idx + 1}
                        </Button>
                      ))}
                    </div>

                    {/* Selected Scenario Details */}
                    {deploymentData.scenarios[selectedScenario] && (
                      <div className="space-y-4">
                        <div className="border-l-4 border-primary pl-4">
                          <h3 className="text-xl font-bold">
                            {deploymentData.scenarios[selectedScenario].title}
                          </h3>
                        </div>

                        {/* Business Context */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Business Context</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-3 md:grid-cols-2">
                              {Object.entries(deploymentData.scenarios[selectedScenario].businessContext).map(([key, value]) => (
                                <div key={key} className="flex justify-between p-2 border-b">
                                  <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span>
                                  <span>{value as string}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Challenges */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Challenges Addressed</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {deploymentData.scenarios[selectedScenario].challenges.map((challenge, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Badge variant="destructive">❌</Badge>
                                  <span>{challenge}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        {/* Deployment Plan */}
                        {deploymentData.scenarios[selectedScenario].deploymentPlan && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Deployment Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {Object.values(deploymentData.scenarios[selectedScenario].deploymentPlan).map((phase: any, idx) => (
                                  <div key={idx} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-bold">{phase.name}</h4>
                                      <Badge>{phase.duration}</Badge>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <h5 className="font-semibold text-sm mb-2">Activities:</h5>
                                        <ul className="text-sm space-y-1 list-disc list-inside">
                                          {phase.activities.map((activity: string, aidx: number) => (
                                            <li key={aidx}>{activity}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-sm mb-2">Deliverables:</h5>
                                        <ul className="text-sm space-y-1 list-disc list-inside">
                                          {phase.deliverables.map((deliverable: string, didx: number) => (
                                            <li key={didx}>{deliverable}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div className="pt-2 border-t">
                                        <span className="font-semibold">Cost: </span>
                                        <span className="text-primary">{phase.cost}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* ROI & Success Metrics */}
                        {deploymentData.scenarios[selectedScenario].expectedROI && (
                          <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                              <CardHeader>
                                <CardTitle>Expected ROI</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {Object.entries(deploymentData.scenarios[selectedScenario].expectedROI).map(([key, value]) => (
                                    <div key={key} className="p-2 border-b">
                                      <div className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                                      <div className="font-semibold text-primary">{value as string}</div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle>Success Metrics</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {deploymentData.scenarios[selectedScenario].successMetrics.map((metric, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <Badge className="bg-green-600">✓</Badge>
                                      <span className="text-sm">{metric}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Summary */}
                        <Card className="bg-primary/5">
                          <CardContent className="pt-6">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="text-center">
                                <div className="text-2xl font-bold">{deploymentData.scenarios[selectedScenario].timeline}</div>
                                <div className="text-sm text-muted-foreground">Timeline</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold">{deploymentData.scenarios[selectedScenario].totalCost}</div>
                                <div className="text-sm text-muted-foreground">Total Cost</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold">{deploymentData.scenarios[selectedScenario].expectedROI?.paybackPeriod || 'N/A'}</div>
                                <div className="text-sm text-muted-foreground">Payback Period</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Deployment scenarios documentation coming soon.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onboarding Checklist Tab */}
        <TabsContent value="onboarding" className="space-y-4">
          {onboardingData ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Client Onboarding Checklist</CardTitle>
                  <CardDescription>
                    Complete step-by-step guide for implementation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">{onboardingData.timeline}</div>
                      <div className="text-sm text-muted-foreground">Total Timeline</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">{onboardingData.phases.length}</div>
                      <div className="text-sm text-muted-foreground">Implementation Phases</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">{onboardingData.totalTasks}</div>
                      <div className="text-sm text-muted-foreground">Total Tasks</div>
                    </div>
                  </div>

                  {/* Phase Selector */}
                  <div className="flex gap-2 flex-wrap mb-6">
                    {onboardingData.phases.map((_phase: any, idx: number) => (
                      <Button
                        key={idx}
                        variant={selectedPhase === idx ? 'default' : 'outline'}
                        onClick={() => setSelectedPhase(idx)}
                        size="sm"
                      >
                        Phase {idx + 1}
                      </Button>
                    ))}
                  </div>

                  {/* Selected Phase Details */}
                  {onboardingData.phases[selectedPhase] && (
                    <div className="space-y-4">
                      <div className="border-l-4 border-primary pl-4">
                        <h3 className="text-lg font-bold">{onboardingData.phases[selectedPhase].phase}</h3>
                        <p className="text-sm text-muted-foreground">{onboardingData.phases[selectedPhase].description}</p>
                      </div>

                      {/* Tasks */}
                      <div className="space-y-3">
                        {onboardingData.phases[selectedPhase].tasks.map((task, idx) => (
                          <Card key={idx}>
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">Task #{task.id}</Badge>
                                    <Badge className={task.status === 'required' ? 'bg-red-600' : 'bg-blue-600'}>
                                      {task.status}
                                    </Badge>
                                    <Badge variant="secondary">{task.duration}</Badge>
                                  </div>
                                  <h4 className="font-semibold mb-2">{task.task}</h4>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    <span className="font-semibold">Owner:</span> {task.owner}
                                  </div>
                                  {task.deliverables && task.deliverables.length > 0 && (
                                    <div>
                                      <div className="text-sm font-semibold mb-1">Deliverables:</div>
                                      <ul className="text-sm space-y-1 list-disc list-inside">
                                        {task.deliverables.map((deliverable, didx) => (
                                          <li key={didx}>{deliverable}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Documents */}
                  {onboardingData.requiredDocuments && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Required Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2 md:grid-cols-2">
                          {onboardingData.requiredDocuments.map((doc, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                              <Badge variant="outline">📄</Badge>
                              <span className="text-sm">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Hardware Requirements */}
                  {onboardingData.hardwareRequirements && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Hardware Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {onboardingData.hardwareRequirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Badge variant="outline">🖥️</Badge>
                              <span className="text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Success Criteria */}
                  {onboardingData.successCriteria && (
                    <Card className="mt-6 bg-green-50">
                      <CardHeader>
                        <CardTitle>Success Criteria</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {onboardingData.successCriteria.map((criteria, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Badge className="bg-green-600">✓</Badge>
                              <span className="text-sm">{criteria}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Onboarding checklist coming soon.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Features & Modules</CardTitle>
              <CardDescription>
                Complete feature breakdown and module documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Core Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Multi-tenant architecture</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Role-based access control (RBAC)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Real-time notifications</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Advanced reporting & analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Mobile apps (iOS + Android)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Cloud & on-premise deployment</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>Automated backups</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-green-600">✓</Badge>
                          <span>99.9% uptime SLA</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Enterprise Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-600">⭐</Badge>
                          <span>Multi-location management</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-600">⭐</Badge>
                          <span>Advanced AI/ML analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-600">⭐</Badge>
                          <span>Custom integrations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-600">⭐</Badge>
                          <span>White-label options</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-600">⭐</Badge>
                          <span>Dedicated support & SLA</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-600">⭐</Badge>
                          <span>Custom workflows</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-600">⭐</Badge>
                          <span>API access & webhooks</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-600">⭐</Badge>
                          <span>Advanced security & compliance</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Technology Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <h5 className="font-semibold mb-2">Frontend</h5>
                        <ul className="text-sm space-y-1">
                          <li>• React 18</li>
                          <li>• Next.js 14</li>
                          <li>• TypeScript</li>
                          <li>• Tailwind CSS</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2">Backend</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Node.js 20</li>
                          <li>• Express.js</li>
                          <li>• GraphQL</li>
                          <li>• REST APIs</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2">Database</h5>
                        <ul className="text-sm space-y-1">
                          <li>• PostgreSQL 15</li>
                          <li>• Redis 7</li>
                          <li>• MongoDB</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2">Infrastructure</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Docker</li>
                          <li>• Kubernetes</li>
                          <li>• AWS/Azure</li>
                          <li>• Nginx</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
