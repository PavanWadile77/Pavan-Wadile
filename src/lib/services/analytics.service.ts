import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VisitorStat } from '@/types';

const VISITOR_ID_KEY = 'pk_portfolio_visitor_id';

export class AnalyticsService {
  /**
   * Get or create a unique visitor ID stored in localStorage
   */
  private static getVisitorId(): string {
    if (typeof window === 'undefined') return '';
    
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  }

  /**
   * Record a page visit
   */
  static async recordVisit(pageUrl: string): Promise<void> {
    if (typeof window === 'undefined') return;

    // Prevent recording stats in development mode or for admin users
    if (process.env.NODE_ENV === 'development') return;

    try {
      const visitorId = this.getVisitorId();
      const userAgent = window.navigator.userAgent;
      
      // Simple device type detection
      let deviceType = 'desktop';
      if (/Mobi|Android/i.test(userAgent)) {
        deviceType = 'mobile';
      } else if (/Tablet|iPad/i.test(userAgent)) {
        deviceType = 'tablet';
      }

      // We can use an external API like ipapi.co to get country, 
      // but for privacy and speed, we might just omit it or use browser timezone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const country = timeZone.split('/')[1]?.replace('_', ' ') || 'Unknown';

      const statData: Omit<VisitorStat, 'id'> = {
        pageUrl,
        userAgent,
        browser: this.getBrowserName(userAgent),
        deviceType,
        country,
        visitorId,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'visitor_stats'), statData);
    } catch (error) {
      console.error('Failed to record visit:', error);
    }
  }

  private static getBrowserName(userAgent: string): string {
    if (userAgent.indexOf("Firefox") > -1) {
      return "Firefox";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      return "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
      return "Internet Explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
      return "Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    } else {
      return "Unknown";
    }
  }
}
