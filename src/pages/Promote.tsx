import React, { useState, useMemo } from 'react';
import { Watch } from '../types/Watch';
import Layout from '../components/Layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Image, Sparkles, Send, Calendar as CalendarIcon, ChevronUp, ChevronDown, X } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Sample watches data - in a real app this would come from the watch management system
const sampleWatches: Watch[] = [
  {
    id: '1',
    name: 'Rolex Submariner 116610LN',
    sku: 'ROL-SUB-001',
    brand: 'Rolex',
    acquisitionCost: 8500,
    status: 'Ready for listing',
    location: 'Denmark',
    description: 'Excellent condition Rolex Submariner with box and papers. No visible scratches on case or bracelet.',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop', useForAI: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=400&fit=crop', useForAI: false },
      { id: '3', url: 'https://images.unsplash.com/photo-1533139502658-0198f9cd6953?w=400&h=400&fit=crop', useForAI: true }
    ]
  },
  {
    id: '2',
    name: 'Omega Speedmaster Professional',
    sku: 'OME-SPE-002',
    brand: 'Omega',
    acquisitionCost: 3200,
    status: 'Listed',
    location: 'Vietnam',
    description: 'Classic moonwatch with manual wind movement. Recently serviced.',
    images: [
      { id: '4', url: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=400&fit=crop', useForAI: false },
      { id: '5', url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop', useForAI: true }
    ]
  },
  {
    id: '3',
    name: 'TAG Heuer Monaco',
    sku: 'TAG-MON-003',
    brand: 'TAG Heuer',
    acquisitionCost: 2800,
    status: 'Ready for listing',
    location: 'Japan',
    description: 'Iconic square case chronograph. Needs minor service.',
    images: [
      { id: '6', url: 'https://images.unsplash.com/photo-1533139502658-0198f9cd6953?w=400&h=400&fit=crop', useForAI: true }
    ]
  }
];

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'bg-black' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' }
];

interface ScheduledPost {
  id: string;
  watchName: string;
  platforms: string[];
  content: string;
  scheduledDate: string;
  scheduledTime: string;
  images: string[];
}

const Promote = () => {
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [postContent, setPostContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      watchName: 'Rolex Submariner 116610LN',
      platforms: ['instagram', 'facebook'],
      content: '✨ Discover this stunning Rolex Submariner! Perfect for collectors...',
      scheduledDate: '2024-12-15',
      scheduledTime: '14:30',
      images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop']
    }
  ]);

  // Filter watches based on search and status
  const filteredWatches = useMemo(() => {
    return sampleWatches.filter(watch => {
      const matchesStatus = statusFilter === 'All' || watch.status === statusFilter;
      const matchesSearch = watch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           watch.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           watch.sku.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter]);

  const handleWatchSelect = (watch: Watch) => {
    setSelectedWatch(watch);
    setPostContent('');
    setSelectedImages([]);
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleImageToggle = (imageUrl: string) => {
    setSelectedImages(prev =>
      prev.includes(imageUrl)
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  const moveImage = (imageUrl: string, direction: 'up' | 'down') => {
    const currentIndex = selectedImages.indexOf(imageUrl);
    if (currentIndex === -1) return;

    const newImages = [...selectedImages];
    if (direction === 'up' && currentIndex > 0) {
      [newImages[currentIndex], newImages[currentIndex - 1]] = [newImages[currentIndex - 1], newImages[currentIndex]];
    } else if (direction === 'down' && currentIndex < newImages.length - 1) {
      [newImages[currentIndex], newImages[currentIndex + 1]] = [newImages[currentIndex + 1], newImages[currentIndex]];
    }
    setSelectedImages(newImages);
  };

  const generateAIContent = async () => {
    if (!selectedWatch) return;
    
    setIsGeneratingContent(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const aiContent = `✨ Discover this stunning ${selectedWatch.brand} ${selectedWatch.name}! 

This exceptional timepiece features:
${selectedWatch.description}

Perfect for collectors and enthusiasts alike. 

#LuxuryWatches #${selectedWatch.brand} #VintageWatches #WatchCollector #Timepieces #SecondVintage`;
      
      setPostContent(aiContent);
      setIsGeneratingContent(false);
    }, 2000);
  };

  const handlePost = () => {
    if (!selectedWatch || selectedPlatforms.length === 0 || !postContent) {
      alert('Please select a watch, platforms, and add content');
      return;
    }

    const isScheduled = scheduleDate && scheduleTime;
    
    if (isScheduled) {
      // Add to scheduled posts
      const newScheduledPost: ScheduledPost = {
        id: Date.now().toString(),
        watchName: selectedWatch.name,
        platforms: selectedPlatforms,
        content: postContent,
        scheduledDate: scheduleDate,
        scheduledTime: scheduleTime,
        images: selectedImages
      };
      setScheduledPosts(prev => [...prev, newScheduledPost]);
    }

    const action = isScheduled ? 'scheduled' : 'posted';
    const when = isScheduled ? ` for ${scheduleDate} at ${scheduleTime}` : ' immediately';
    
    alert(`Post ${action} successfully${when} on ${selectedPlatforms.map(id => socialPlatforms.find(p => p.id === id)?.name).join(', ')}!`);
    
    // Reset form
    setSelectedWatch(null);
    setSelectedPlatforms([]);
    setPostContent('');
    setScheduleDate('');
    setScheduleTime('');
    setSelectedImages([]);
  };

  const removeScheduledPost = (postId: string) => {
    setScheduledPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Promote / Social Media</h1>
          <p className="text-slate-600 mt-1">Create and schedule social media posts for your watches with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Watch Selection */}
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Select Watch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Search watches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Listed">Listed</SelectItem>
                      <SelectItem value="Reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Watch List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredWatches.map((watch) => (
                    <div
                      key={watch.id}
                      onClick={() => handleWatchSelect(watch)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 ${
                        selectedWatch?.id === watch.id ? 'border-amber-500 bg-amber-50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {watch.images?.[0] ? (
                                <img 
                                  src={watch.images[0].url} 
                                  alt={watch.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-slate-400 text-xs">📷</span>
                              )}
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="flex justify-center">
                              {watch.images?.[0] ? (
                                <img 
                                  src={watch.images[0].url} 
                                  alt={watch.name}
                                  className="w-64 h-64 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-64 h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                                  <span className="text-slate-400 text-4xl">📷</span>
                                </div>
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{watch.name}</div>
                          <div className="text-xs text-slate-500">{watch.brand}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {watch.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Post Creation */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Create Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedWatch ? (
                  <>
                    {/* Selected Watch Preview */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                          {selectedWatch.images?.[0] ? (
                            <img 
                              src={selectedWatch.images[0].url} 
                              alt={selectedWatch.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              📷
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedWatch.name}</h3>
                          <p className="text-sm text-slate-600">{selectedWatch.brand}</p>
                          <Badge variant="secondary" className="mt-1">
                            {selectedWatch.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Image Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Select Images ({selectedImages.length} selected)
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {selectedWatch.images.map((image) => (
                          <div key={image.id} className="relative">
                            <img
                              src={image.url}
                              alt="Watch"
                              className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                                selectedImages.includes(image.url)
                                  ? 'border-amber-500'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                              onClick={() => handleImageToggle(image.url)}
                            />
                            {selectedImages.includes(image.url) && (
                              <div className="absolute top-1 right-1 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                {selectedImages.indexOf(image.url) + 1}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Selected Images Order */}
                      {selectedImages.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-700 mb-2">Image Order</h4>
                          <div className="space-y-2">
                            {selectedImages.map((imageUrl, index) => (
                              <div key={imageUrl} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                <img
                                  src={imageUrl}
                                  alt="Selected"
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <span className="text-sm font-medium flex-1">Image {index + 1}</span>
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => moveImage(imageUrl, 'up')}
                                    disabled={index === 0}
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => moveImage(imageUrl, 'down')}
                                    disabled={index === selectedImages.length - 1}
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleImageToggle(imageUrl)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Platform Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Select Platforms
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {socialPlatforms.map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() => handlePlatformToggle(platform.id)}
                            className={`p-3 border rounded-lg text-left transition-all hover:bg-slate-50 ${
                              selectedPlatforms.includes(platform.id)
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{platform.icon}</span>
                              <span className="font-medium">{platform.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content Generation */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-slate-700">
                          Post Content
                        </label>
                        <Button
                          onClick={generateAIContent}
                          disabled={isGeneratingContent}
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          {isGeneratingContent ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate with AI
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Write your post content or use AI to generate it..."
                        className="min-h-32"
                      />
                    </div>

                    {/* Scheduling */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Schedule Date (Optional)
                        </label>
                        <Input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Schedule Time (Optional)
                        </label>
                        <Input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={handlePost}
                      disabled={selectedPlatforms.length === 0 || !postContent.trim()}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      size="lg"
                    >
                      {scheduleDate && scheduleTime ? (
                        <>
                          <CalendarIcon className="h-5 w-5 mr-2" />
                          Schedule Post
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Post Now
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📱</div>
                    <h3 className="text-xl font-medium text-slate-900 mb-2">Select a Watch</h3>
                    <p className="text-slate-600">Choose a watch from the list to create a social media post</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Scheduled Content */}
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scheduled Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {scheduledPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600">No scheduled posts</p>
                    </div>
                  ) : (
                    scheduledPosts.map((post) => (
                      <div key={post.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm truncate">{post.watchName}</h4>
                            <p className="text-xs text-slate-500">
                              {post.scheduledDate} at {post.scheduledTime}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeScheduledPost(post.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {post.platforms.map((platformId) => {
                            const platform = socialPlatforms.find(p => p.id === platformId);
                            return (
                              <Badge key={platformId} variant="secondary" className="text-xs">
                                {platform?.icon} {platform?.name}
                              </Badge>
                            );
                          })}
                        </div>
                        
                        {post.images.length > 0 && (
                          <div className="flex gap-1">
                            {post.images.slice(0, 3).map((imageUrl, index) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt="Scheduled"
                                className="w-8 h-8 object-cover rounded"
                              />
                            ))}
                            {post.images.length > 3 && (
                              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                                <span className="text-xs text-slate-600">+{post.images.length - 3}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <p className="text-xs text-slate-600 line-clamp-2">{post.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Promote;
