import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const fetchHNStories = async () => {
  const response = await axios.get('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  return response.data.hits;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['hnStories'],
    queryFn: fetchHNStories,
  });

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="text-center text-red-500">Error fetching stories</div>;

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-800">Hacker News Top 100</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8 max-w-md mx-auto border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array(9).fill().map((_, index) => (
              <Card key={index} className="w-full bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4 bg-yellow-200" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/4 mb-2 bg-yellow-200" />
                  <Skeleton className="h-4 w-1/2 bg-yellow-200" />
                </CardContent>
              </Card>
            ))
          : filteredStories?.map((story) => (
              <Card key={story.objectID} className="w-full bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-800">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-600 mb-2">Upvotes: {story.points}</p>
                  <Button
                    variant="link"
                    className="p-0 text-yellow-700 hover:text-yellow-900"
                    onClick={() => window.open(story.url, '_blank')}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Index;
