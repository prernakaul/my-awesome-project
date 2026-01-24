import React from 'react';
import { Activity } from '../../types';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="activity-card">
      <div className="activity-time">
        <span className="time-badge">{activity.time}</span>
        <span className="duration">{activity.duration}</span>
      </div>

      <div className="activity-content">
        <h4 className="activity-name">{activity.name}</h4>
        <p className="activity-description">{activity.description}</p>

        {activity.location && (
          <div className="activity-location">
            <span className="location-icon">📍</span>
            {activity.location}
          </div>
        )}

        <div className="activity-meta">
          {activity.cost !== undefined && (
            <span className="activity-cost">
              {activity.cost === 0 ? 'Free' : `$${activity.cost}`}
            </span>
          )}
          {activity.accessibility && (
            <span className="activity-accessibility" title={activity.accessibility}>
              ♿ {activity.accessibility}
            </span>
          )}
        </div>

        {activity.tips && (
          <div className="activity-tips">
            <span className="tip-icon">💡</span>
            {activity.tips}
          </div>
        )}
      </div>
    </div>
  );
};
