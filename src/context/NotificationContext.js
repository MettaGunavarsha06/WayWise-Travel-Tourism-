import React, { createContext, useContext, useState } from 'react';

const initialDemoNotifications = [
  {
    id: 'notif_1',
    title: '🏨 Hotel Check-In Tomorrow',
    message: 'Your stay at Bay Breeze Eco-Luxury Resort is scheduled for tomorrow at 11:00 AM.',
    time: '10 mins ago',
    type: 'hotel',
    unread: true,
  },
  {
    id: 'notif_2',
    title: '🌧️ Weather Alert: Rain Expected',
    message: 'Rain expected tomorrow. Tap to swap outdoor beach stops to air-conditioned naval museums.',
    time: '1 hour ago',
    type: 'weather',
    unread: true,
  },
  {
    id: 'notif_3',
    title: '👥 High Crowd Density Detected',
    message: 'Crowd levels are peak (88%) at RK Beach. We found 3 tranquil alternatives nearby.',
    time: '3 hours ago',
    type: 'crowd',
    unread: true,
  },
  {
    id: 'notif_4',
    title: '💰 AI Budget Status',
    message: 'Great planning! You have ₹2,000 remaining in your trip budget.',
    time: '5 hours ago',
    type: 'budget',
    unread: false,
  },
  {
    id: 'notif_5',
    title: '🌱 Eco-Tourism Milestone',
    message: 'You earned 50 Eco-Points by choosing electric rail over cab transit!',
    time: '1 day ago',
    type: 'eco',
    unread: false,
  },
];

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
  triggerDemoNotification: () => {},
  clearAll: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialDemoNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const triggerDemoNotification = (customNotif) => {
    const newEntry = {
      id: `notif_${Date.now()}`,
      title: customNotif?.title || '🔔 SmartTour Alert',
      message: customNotif?.message || 'New tourism updates available for your itinerary.',
      time: 'Just now',
      type: customNotif?.type || 'general',
      unread: true,
    };
    setNotifications((prev) => [newEntry, ...prev]);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        triggerDemoNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
