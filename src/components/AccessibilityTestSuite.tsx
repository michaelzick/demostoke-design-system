import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import {
  runAccessibilityTests,
  type ContrastTestResult,
  type AccessibilityTestResult
} from '@/utils/accessibility-test';
import { useTheme } from 'next-themes';

export function AccessibilityTestSuite() {
  const { theme, resolvedTheme } = useTheme();
  const [testResults, setTestResults] = useState<{
    contrastTests: { [key: string]: ContrastTestResult };
    behaviorTests: { [key: string]: AccessibilityTestResult };
    overallScore: number;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runTests = async () => {
    setIsRunning(true);

    // Small delay to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const results = runAccessibilityTests();
      setTestResults(results);
      console.log('Accessibility Test Results:', results);
    } catch (error) {
      console.error('Error running accessibility tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getContrastBadgeVariant = (result: ContrastTestResult) => {
    switch (result.status) {
      case 'pass': return result.wcagAAA ? 'default' : 'secondary';
      case 'warning': return 'warning';
      case 'fail': return 'destructive';
      default: return 'outline';
    }
  };

  const getContrastIcon = (result: ContrastTestResult) => {
    switch (result.status) {
      case 'pass': return result.wcagAAA ? '🟢' : '🟡';
      case 'warning': return '🟠';
      case 'fail': return '🔴';
      default: return '⚪';
    }
  };

  if (!mounted) {
    return <div>Loading accessibility tests...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Accessibility Test Suite
            <Badge variant="outline">
              Current Theme: {resolvedTheme || theme}
            </Badge>
          </CardTitle>
          <CardDescription>
            Comprehensive WCAG 2.1 compliance testing for the DemoStoke design system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={runTests}
              disabled={isRunning}
              variant="default"
            >
              {isRunning ? 'Running Tests...' : 'Run Accessibility Tests'}
            </Button>

            {testResults && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Overall Score:</span>
                <Badge
                  variant={testResults.overallScore >= 90 ? 'default' : testResults.overallScore >= 70 ? 'warning' : 'destructive'}
                  className="text-sm"
                >
                  {testResults.overallScore}%
                </Badge>
              </div>
            )}
          </div>

          {testResults && (
            <Progress value={testResults.overallScore} className="w-full" />
          )}

          {testResults && testResults.overallScore < 100 && (
            <Alert>
              <AlertDescription>
                Some accessibility issues were found. Review the detailed results below for recommendations.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {testResults && (
        <Tabs defaultValue="contrast" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contrast">Color Contrast Tests</TabsTrigger>
            <TabsTrigger value="behavior">Behavioral Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="contrast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>WCAG Color Contrast Compliance</CardTitle>
                <CardDescription>
                  Testing all color combinations against WCAG 2.1 AA and AAA standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(testResults.contrastTests).map(([key, result]) => (
                    <div key={key} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getContrastIcon(result)}</span>
                          <Badge variant={getContrastBadgeVariant(result)}>
                            {result.level}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Contrast Ratio:</span>
                          <div className="text-lg font-mono">{result.ratio}:1</div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={result.wcagAA ? 'text-green-600' : 'text-red-600'}>
                              {result.wcagAA ? '✓' : '✗'}
                            </span>
                            <span>WCAG AA (4.5:1)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={result.wcagAAA ? 'text-green-600' : 'text-red-600'}>
                              {result.wcagAAA ? '✓' : '✗'}
                            </span>
                            <span>WCAG AAA (7:1)</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={result.wcagAALarge ? 'text-green-600' : 'text-red-600'}>
                              {result.wcagAALarge ? '✓' : '✗'}
                            </span>
                            <span>AA Large Text (3:1)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={result.wcagAAALarge ? 'text-green-600' : 'text-red-600'}>
                              {result.wcagAAALarge ? '✓' : '✗'}
                            </span>
                            <span>AAA Large Text (4.5:1)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: result.foreground }}
                            title={`Foreground: ${result.foreground}`}
                          />
                          <span className="text-xs font-mono">{result.foreground}</span>
                        </div>
                        <span className="text-muted-foreground">on</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: result.background }}
                            title={`Background: ${result.background}`}
                          />
                          <span className="text-xs font-mono">{result.background}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Accessibility Tests</CardTitle>
                <CardDescription>
                  Testing keyboard navigation, focus management, and ARIA compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(testResults.behaviorTests).map(([key, result]) => (
                    <div key={key} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{result.testName}</h4>
                        <Badge variant={result.success ? 'default' : 'destructive'}>
                          {result.success ? 'Pass' : 'Fail'}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {result.details}
                      </p>

                      {result.recommendations && result.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-destructive">
                            Issues Found:
                          </h5>
                          <ul className="space-y-1 text-sm">
                            {result.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Screen Reader Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Testing Instructions</CardTitle>
          <CardDescription>
            Additional accessibility tests that require manual verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Screen Reader Testing</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Test with NVDA (Windows), JAWS (Windows), or VoiceOver (macOS)</li>
                <li>• Verify all interactive elements are announced correctly</li>
                <li>• Check that color information is not the only way to convey meaning</li>
                <li>• Ensure proper reading order and navigation landmarks</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Keyboard Navigation Testing</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Tab through all interactive elements in logical order</li>
                <li>• Verify focus indicators are clearly visible</li>
                <li>• Test Escape key functionality in modals and dropdowns</li>
                <li>• Ensure no keyboard traps exist</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Color Vision Testing</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Test with color blindness simulators</li>
                <li>• Verify information is not conveyed by color alone</li>
                <li>• Check that interactive states are distinguishable</li>
                <li>• Ensure sufficient contrast in all color combinations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
