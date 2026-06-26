"use client";

import { useState, useEffect } from "react";
import { FirebaseService } from "@/lib/services/firebase.service";
import { VisitorStat } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Users, Eye, Globe, Laptop, Smartphone, Tablet } from "lucide-react";

const statsService = new FirebaseService<VisitorStat>("visitor_stats");

export default function VisitorStatsViewer() {
  const [stats, setStats] = useState<VisitorStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Aggregated data
  const [totalPageViews, setTotalPageViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [deviceStats, setDeviceStats] = useState({ desktop: 0, mobile: 0, tablet: 0 });
  const [topPages, setTopPages] = useState<{ url: string, count: number }[]>([]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Let's get up to 1000 latest stats for performance in dashboard
      const { data } = await statsService.getPaginated(1000, null, "timestamp", "desc");
      
      setStats(data);
      
      // Calculate analytics
      setTotalPageViews(data.length);
      
      const uniqueIds = new Set(data.map(s => s.visitorId));
      setUniqueVisitors(uniqueIds.size);

      let desktop = 0;
      let mobile = 0;
      let tablet = 0;
      
      const pageCounts: Record<string, number> = {};

      data.forEach(stat => {
        if (stat.deviceType === 'desktop') desktop++;
        if (stat.deviceType === 'mobile') mobile++;
        if (stat.deviceType === 'tablet') tablet++;
        
        pageCounts[stat.pageUrl] = (pageCounts[stat.pageUrl] || 0) + 1;
      });

      setDeviceStats({ desktop, mobile, tablet });

      const sortedPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([url, count]) => ({ url, count }));
        
      setTopPages(sortedPages);

    } catch {
      toast.error("Error fetching visitor stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, []);

  if (loading && stats.length === 0) return <div className="p-8 text-center text-foreground/50">Loading stats...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <Eye size={24} />
              </div>
              <div>
                <p className="text-sm text-foreground/60 font-medium">Total Page Views</p>
                <h3 className="text-3xl font-bold">{totalPageViews}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-foreground/60 font-medium">Unique Visitors</p>
                <h3 className="text-3xl font-bold">{uniqueVisitors}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <p className="text-sm text-foreground/60 font-medium mb-4">Device Breakdown</p>
            <div className="flex justify-around items-center h-full">
              <div className="flex flex-col items-center gap-2">
                <Laptop size={24} className="text-foreground/70" />
                <span className="text-xl font-bold">{deviceStats.desktop}</span>
                <span className="text-xs text-foreground/50">Desktop</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Smartphone size={24} className="text-foreground/70" />
                <span className="text-xl font-bold">{deviceStats.mobile}</span>
                <span className="text-xs text-foreground/50">Mobile</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Tablet size={24} className="text-foreground/70" />
                <span className="text-xl font-bold">{deviceStats.tablet}</span>
                <span className="text-xs text-foreground/50">Tablet</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Recent Visits</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-foreground/60 uppercase bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Page URL</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Browser</th>
                    <th className="px-4 py-3 rounded-tr-lg">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.slice(0, 10).map((stat) => {
                    const timestampSeconds = (stat.timestamp as { seconds?: number })?.seconds;
                    return (
                    <tr key={stat.id} className="border-b border-border/50 hover:bg-secondary/10">
                      <td className="px-4 py-3 font-medium text-primary">{stat.pageUrl}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <Globe size={14} className="text-foreground/50" /> 
                        {stat.country || 'Unknown'}
                      </td>
                      <td className="px-4 py-3">{stat.browser}</td>
                      <td className="px-4 py-3 text-foreground/60">
                        {timestampSeconds 
                          ? formatDistanceToNow(new Date(timestampSeconds * 1000), { addSuffix: true }) 
                          : "Just now"}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Top Pages</h3>
            <div className="space-y-4">
              {topPages.map((page, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                  <span className="text-sm font-medium truncate max-w-[200px]" title={page.url}>
                    {page.url}
                  </span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">
                    {page.count}
                  </span>
                </div>
              ))}
              {topPages.length === 0 && (
                <div className="text-center text-foreground/50 text-sm py-4">
                  No data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
