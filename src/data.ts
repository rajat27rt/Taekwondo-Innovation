import { TelemetrySession, AnalystPlatform } from './types';

export const INITIAL_SESSIONS: TelemetrySession[] = [
  {
    id: 's1',
    label: 'TKD_SPARRING_WK4',
    date: 'Oct 24, 2023',
    time: '09:15 AM',
    formats: ['CSV', 'JSON'],
    kicksCount: 142,
    status: 'Validated',
    details: {
      duration: '45 mins',
      athlete: 'Jade J. (Featherweight)',
      accelMax: 16.4,
      spinAvg: 410,
      contactDuration: 6.2,
      avgVelocity: 94
    }
  },
  {
    id: 's2',
    label: 'DOLYEO_CHAGI_SPEED_A',
    date: 'Oct 23, 2023',
    time: '02:40 PM',
    formats: ['CSV'],
    kicksCount: 88,
    status: 'Validated',
    details: {
      duration: '30 mins',
      athlete: 'Dae-Hoon L. (Lightweight)',
      accelMax: 18.8,
      spinAvg: 580,
      contactDuration: 5.4,
      avgVelocity: 112
    }
  },
  {
    id: 's3',
    label: 'DWIT_CHAGI_SPIN_POWER',
    date: 'Oct 22, 2023',
    time: '11:00 AM',
    formats: ['JSON'],
    kicksCount: 210,
    status: 'Review Req',
    details: {
      duration: '60 mins',
      athlete: 'Panipak W. (Flyweight)',
      accelMax: 22.2,
      spinAvg: 890,
      contactDuration: 7.0,
      avgVelocity: 124
    }
  },
  {
    id: 's4',
    label: 'TKD_MATCH_REPLAY_S1',
    date: 'Oct 21, 2023',
    time: '07:20 PM',
    formats: ['CSV', 'JSON'],
    kicksCount: 54,
    status: 'Validated',
    details: {
      duration: '90 mins',
      athlete: 'National Team Drills',
      accelMax: 17.1,
      spinAvg: 480,
      contactDuration: 6.5,
      avgVelocity: 88
    }
  },
  {
    id: 's5',
    label: 'NAERYEO_CHAGI_VELOCITY',
    date: 'Oct 18, 2023',
    time: '04:15 PM',
    formats: ['JSON'],
    kicksCount: 120,
    status: 'Validated',
    details: {
      duration: '40 mins',
      athlete: 'Jade J. (Featherweight)',
      accelMax: 19.5,
      spinAvg: 510,
      contactDuration: 5.9,
      avgVelocity: 108
    }
  },
  {
    id: 's6',
    label: 'DWIT_CHAGI_OPTIMIZATION',
    date: 'Oct 15, 2023',
    time: '10:30 AM',
    formats: ['CSV', 'JSON'],
    kicksCount: 35,
    status: 'Review Req',
    details: {
      duration: '25 mins',
      athlete: 'Jafar S. (Welterweight)',
      accelMax: 21.9,
      spinAvg: 780,
      contactDuration: 6.9,
      avgVelocity: 118
    }
  }
];

export const INITIAL_PLATFORMS: AnalystPlatform[] = [
  {
    id: 'p1',
    name: 'Daedo PSS Core',
    status: 'active',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN1ZnsID-S9TeeMpWHb7RUduL8Cuw77p7dtc8HZWYZMRuMeJhQnm7ZczdVt_j0TtbhyQNe1XWfrxNgSaZ_IRmGQoLi_yIvvoZuOQuO_V3BXHc3ByYAGzEYBUcBZJVXPAknz588xDrwchuqNSzE4y1Isp4mbLdacHm-_QJuwbIyJPE3JebDfZ4c6lXG95vp0zKnrtBK15RokPRI6FLYV3mMjxSMhGM0lqNtHoZinkA3z_1anZ0iqAojJ0PrEnQR_Xzv7CAfWtYQGQw'
  },
  {
    id: 'p2',
    name: 'KP&P Ring Sync',
    status: 'linked',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGfGHIm21nyUVx_4LTRyPGD48Pr9H8pSKfMVjnvEO024V3rXhish8cPEeWQV4UgxzxJcb28Wwzs9Czd7djKfHavcRZ3ysSLMQxDSs9f7HkKfMqXGrUAjCfrdqizXSVBq-yDQlNzDimzTxY_qi-XUwjjdsWRnJ1URhxj947KF0E09i-f1jUHZksZtfJgeqzu4Xmty3Yfw3mfik0oMcyCrW5PoJmvNME1WQHQUsvFzJCLrsIDh-I1uh9z3vBOdnob7p9xpihSmB3Ax4'
  },
  {
    id: 'p3',
    name: 'Dartfish Biomechanics',
    status: 'offline',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATnzJXaEliLEpquLv1QXQm28qSANiMJez2UW6I8gZeval--Zr5Y8DF9Z6VUjtulkDY58wPqjph2BKEwZzJ_oq442YQiTghTSEh0D4cpMZFlC9OFFLTBX16NjfJ9IeClK0u3w6BivI7heFf8cN7eOgaFOUD-t_3BxWGvre1gLyWG4S4higtXrXyTzpKT8lwM_8fOW21d2uRvT4m9FOJ1auUUTY8HEgFAQM9HxObPb0aHXhIRBX9eavc6zgNyEIjLigdLWoDQlfJ9Yo'
  }
];

export const VISUAL_ASSETS = {
  analystAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3r54d74ff90A-ZXcpGw-KdaBwzN_Ht6QUg0-hGidynWbFnuunuqu3rg4zgHBpQmyFhl7DWaJWcIlx4NHq8kK1A1uo_lRy8B9nsJ0-73kLHLLAfmXr8L1tl15L_w9aobmtlJgBWeNPpT2B8wfCm2Eqi_3bHTUGDKhaDO4DjAgnezy5vHxUlgzvg6I8kkjSwG8zr1zc-pr45SpE_PgQ5kiFhCbrWcIQRvZwY0zN1nE9rlLbkVpJ4aZNcFWYZN9dS8I0dYXZgV6AD4M',
  quickPreviewKick: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxvqGJz9dhIRqIsYuHrYACYvC_JZI6Rt_8ZwgNZ8ZTUsM2gkMaAA_W7slFnOR70woxPGobi2S8WNfzH_QtIrCK8Zd_cXPNU-a6UbONMELVs61Qe2WJz7JZzuPwVH1qpHO_GZJM4H8Y6VD2TY31RzkZJ7NwwzS9CE_F1SIKNd23a9gluXyREs1Y2VyZ-4JY-rh9klrLMpmT88J-h3U2GOgFfo7aSRYL8rmoMWY-6nnzfdwyobk1WxS107_AwMpZxhSWq0ezaW8roks'
};
