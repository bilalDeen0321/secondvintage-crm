
import { Head } from '@inertiajs/react';
import { Database, Download, FileText, Image, Package, RefreshCw, Upload, Wrench } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

const Tools = () => {
  const [bulkText, setBulkText] = useState('');
  const [csvData, setCsvData] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [shippingCarrier, setShippingCarrier] = useState('');

  const handleBulkUpload = () => {
    console.log('Bulk upload:', bulkText);
    // Handle bulk upload logic
  };

  const handleDataExport = () => {
    console.log('Exporting data...');
    // Handle data export logic
  };

  const handleImageResize = () => {
    if (imageFile) {
      console.log('Resizing image:', imageFile.name);
      // Handle image resize logic
    }
  };

  const handleDatabaseBackup = () => {
    console.log('Creating database backup...');
    // Handle backup logic
  };

  const handleLabelGeneration = () => {
    console.log('Generating label for:', shippingCarrier);
    // Handle label generation logic
  };

  return (
    <Layout>
      <Head title="Tools & Utilities" />
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tools & Utilities</h1>
          <p className="text-muted-foreground">Administrative tools and system utilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bulk Watch Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Bulk Watch Upload
              </CardTitle>
              <CardDescription>Upload multiple watches at once using CSV or text format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bulk-text">Watch Data (CSV format)</Label>
                <Textarea
                  id="bulk-text"
                  placeholder="Brand,Model,Year,Price&#10;Rolex,Submariner,1995,12000&#10;Omega,Speedmaster,1998,5000"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleBulkUpload} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Process Upload
              </Button>
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Data Export
              </CardTitle>
              <CardDescription>Export watch data in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Export Options</Label>
                <div className="space-y-2">
                  <Button variant="outline" onClick={handleDataExport} className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Export as CSV
                  </Button>
                  <Button variant="outline" onClick={handleDataExport} className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Export as Excel
                  </Button>
                  <Button variant="outline" onClick={handleDataExport} className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Processing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="mr-2 h-5 w-5" />
                Image Processing
              </CardTitle>
              <CardDescription>Resize and optimize watch images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image-upload">Select Images</Label>
                <Input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleImageResize} className="text-xs">
                  Resize (800x600)
                </Button>
                <Button variant="outline" onClick={handleImageResize} className="text-xs">
                  Optimize
                </Button>
              </div>
              <Button onClick={handleImageResize} className="w-full">
                Process Images
              </Button>
            </CardContent>
          </Card>

          {/* Label Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Label Generator
              </CardTitle>
              <CardDescription>Generate shipping labels for packages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shipping-carrier">Shipping Carrier</Label>
                <Select value={shippingCarrier} onValueChange={setShippingCarrier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dhl">DHL</SelectItem>
                    <SelectItem value="fedex">FedEx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="recipient-address">Recipient Address</Label>
                <Textarea
                  id="recipient-address"
                  placeholder="Enter recipient address..."
                  rows={3}
                />
              </div>
              <Button onClick={handleLabelGeneration} className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Generate Label
              </Button>
            </CardContent>
          </Card>

          {/* Database Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Database Tools
              </CardTitle>
              <CardDescription>Database maintenance and backup tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline" onClick={handleDatabaseBackup} className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Create Backup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Optimize Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Wrench className="mr-2 h-4 w-4" />
                  Data Cleanup
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Last backup: June 5, 2024 at 2:30 PM
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="mr-2 h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>Monitor system health and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage</span>
                  <Badge variant="outline">78% Used</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Response</span>
                  <Badge className="bg-green-100 text-green-800">125ms</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime</span>
                  <Badge variant="secondary">99.9%</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Tools;
