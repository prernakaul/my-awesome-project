import React from 'react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

interface ParsedActivity {
  time: string;
  name: string;
  duration: string;
  cost: string;
  description: string;
}

interface ParsedDay {
  day: string;
  title: string;
  activities: ParsedActivity[];
  meals: { breakfast?: string; lunch?: string; dinner?: string };
  notes: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Parse itinerary_day block
  const parseItineraryDay = (block: string): ParsedDay | null => {
    try {
      const getField = (field: string): string => {
        const regex = new RegExp(`^${field}:\\s*(.+)$`, 'im');
        const match = block.match(regex);
        return match ? match[1].trim() : '';
      };

      const day = getField('DAY');
      const title = getField('TITLE');
      const notes = getField('NOTES');

      // Parse activities
      const activities: ParsedActivity[] = [];
      const activityRegex = /- TIME:\s*([^|]+)\|\s*NAME:\s*([^|]+)\|\s*DURATION:\s*([^|]+)\|\s*COST:\s*([^|]+)\|\s*DESCRIPTION:\s*([^\n]+)/g;
      let actMatch;
      while ((actMatch = activityRegex.exec(block)) !== null) {
        activities.push({
          time: actMatch[1].trim(),
          name: actMatch[2].trim(),
          duration: actMatch[3].trim(),
          cost: actMatch[4].trim(),
          description: actMatch[5].trim()
        });
      }

      // Parse meals
      const meals: { breakfast?: string; lunch?: string; dinner?: string } = {};
      const breakfastMatch = block.match(/- BREAKFAST:\s*(.+)/i);
      const lunchMatch = block.match(/- LUNCH:\s*(.+)/i);
      const dinnerMatch = block.match(/- DINNER:\s*(.+)/i);
      if (breakfastMatch) meals.breakfast = breakfastMatch[1].trim();
      if (lunchMatch) meals.lunch = lunchMatch[1].trim();
      if (dinnerMatch) meals.dinner = dinnerMatch[1].trim();

      return { day, title, activities, meals, notes };
    } catch (e) {
      console.error('Error parsing itinerary day:', e);
      return null;
    }
  };

  // Render itinerary day
  const renderItineraryDay = (dayData: ParsedDay, idx: number): React.ReactNode => {
    return (
      <div key={idx} className="itinerary-day-card">
        <div className="day-header-inline">
          <span className="day-badge">Day {dayData.day}</span>
          <h4>{dayData.title}</h4>
        </div>

        <div className="activities-timeline">
          {dayData.activities.map((activity, aIdx) => (
            <div key={aIdx} className="activity-item">
              <div className="activity-time-col">
                <span className="activity-time">{activity.time}</span>
                <span className="activity-duration">{activity.duration}</span>
              </div>
              <div className="activity-details">
                <strong>{activity.name}</strong>
                <span className="activity-cost">{activity.cost}</span>
                <p>{activity.description}</p>
              </div>
            </div>
          ))}
        </div>

        {(dayData.meals.breakfast || dayData.meals.lunch || dayData.meals.dinner) && (
          <div className="meals-section">
            <strong>Meals:</strong>
            <div className="meals-list">
              {dayData.meals.breakfast && <span>🍳 {dayData.meals.breakfast}</span>}
              {dayData.meals.lunch && <span>🍽️ {dayData.meals.lunch}</span>}
              {dayData.meals.dinner && <span>🍷 {dayData.meals.dinner}</span>}
            </div>
          </div>
        )}

        {dayData.notes && (
          <div className="day-notes-inline">
            <strong>💡 Tip:</strong> {dayData.notes}
          </div>
        )}
      </div>
    );
  };

  // Parse markdown table
  const parseTable = (tableText: string): React.ReactNode => {
    const lines = tableText.trim().split('\n');
    if (lines.length < 2) return null;

    const headerLine = lines[0];
    const headerCells = headerLine.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
    const dataLines = lines.slice(2);

    return (
      <table className="message-table">
        <thead>
          <tr>
            {headerCells.map((cell, idx) => (
              <th key={idx}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataLines.map((line, rowIdx) => {
            const cells = line.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
            return (
              <tr key={rowIdx}>
                {cells.map((cell, cellIdx) => (
                  <td key={cellIdx}>{cell}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Format the message content
  const formatContent = (content: string): React.ReactNode => {
    const elements: React.ReactNode[] = [];

    // Extract and render itinerary days
    const itineraryRegex = /```itinerary_day\n([\s\S]*?)```/g;
    let itinMatch;
    const itineraryDays: ParsedDay[] = [];

    // First, parse all itinerary blocks
    while ((itinMatch = itineraryRegex.exec(content)) !== null) {
      const dayData = parseItineraryDay(itinMatch[1]);
      if (dayData) {
        itineraryDays.push(dayData);
      }
    }

    // If we found itinerary days, render them with intro/outro
    if (itineraryDays.length > 0) {
      // Add any text before itineraries
      const firstBlockIndex = content.indexOf('```itinerary_day');
      const textBefore = content.slice(0, firstBlockIndex);
      if (textBefore.trim()) {
        const cleanText = textBefore
          .replace(/```destination[\s\S]*?```/g, '')
          .replace(/\[PREFERENCE_UPDATE:[^\]]+\]/g, '')
          .trim();
        if (cleanText) {
          elements.push(<div key="intro">{formatParagraphs(cleanText)}</div>);
        }
      }

      // Render itinerary days
      elements.push(
        <div key="itinerary" className="itinerary-container">
          {itineraryDays.map((day, idx) => renderItineraryDay(day, idx))}
        </div>
      );

      // Add any text after all itineraries
      const lastBlockEnd = content.lastIndexOf('```') + 3;
      const textAfter = content.slice(lastBlockEnd);
      if (textAfter.trim()) {
        const cleanText = textAfter
          .replace(/```destination[\s\S]*?```/g, '')
          .replace(/\[PREFERENCE_UPDATE:[^\]]+\]/g, '')
          .trim();
        if (cleanText) {
          elements.push(<div key="outro">{formatParagraphs(cleanText)}</div>);
        }
      }

      return <>{elements}</>;
    }

    // No itinerary blocks - process normally
    const cleanContent = content
      .replace(/```destination[\s\S]*?```/g, '')
      .replace(/```itinerary_day[\s\S]*?```/g, '')
      .replace(/\[PREFERENCE_UPDATE:[^\]]+\]/g, '')
      .trim();

    // Check for markdown table
    const tableMatch = cleanContent.match(/(\|[^\n]+\|\n\|[-|\s]+\|\n(?:\|[^\n]+\|\n?)+)/);

    if (tableMatch) {
      const parts = cleanContent.split(tableMatch[0]);
      const beforeTable = parts[0];
      const afterTable = parts.slice(1).join('');

      return (
        <>
          {beforeTable && formatParagraphs(beforeTable)}
          {parseTable(tableMatch[0])}
          {afterTable && formatParagraphs(afterTable)}
        </>
      );
    }

    return formatParagraphs(cleanContent);
  };

  const formatParagraphs = (text: string): React.ReactNode => {
    const paragraphs = text.split('\n\n').filter(Boolean);

    return paragraphs.map((para, idx) => {
      para = para.replace(/`([^`]+)`/g, '<code>$1</code>');
      para = para.replace(/_([^_]+)_/g, '<em>$1</em>');

      if (para.includes('\n-') || para.startsWith('-')) {
        const lines = para.split('\n');
        return (
          <div key={idx} className="message-list">
            {lines.map((line, lineIdx) => {
              if (line.startsWith('-')) {
                const formatted = line.substring(1).trim()
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  .replace(/`([^`]+)`/g, '<code>$1</code>');
                return <div key={lineIdx} className="message-list-item" dangerouslySetInnerHTML={{ __html: formatted }} />;
              }
              return <p key={lineIdx}>{line}</p>;
            })}
          </div>
        );
      }

      if (/^\d+\./.test(para)) {
        const lines = para.split('\n');
        return (
          <ol key={idx} className="message-ordered-list">
            {lines.map((line, lineIdx) => {
              const match = line.match(/^\d+\.\s*\*\*([^*]+)\*\*\s*(.*)$/);
              if (match) {
                return (
                  <li key={lineIdx}>
                    <strong>{match[1]}</strong> {match[2]}
                  </li>
                );
              }
              const simpleMatch = line.match(/^\d+\.\s*(.+)$/);
              if (simpleMatch) {
                return <li key={lineIdx}>{simpleMatch[1]}</li>;
              }
              return null;
            }).filter(Boolean)}
          </ol>
        );
      }

      if (para.startsWith('###')) {
        return <h4 key={idx}>{para.replace(/^###\s*/, '')}</h4>;
      }
      if (para.startsWith('##')) {
        return <h3 key={idx}>{para.replace(/^##\s*/, '')}</h3>;
      }

      const formattedPara = para.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

      return (
        <p key={idx} dangerouslySetInnerHTML={{ __html: formattedPara }} />
      );
    });
  };

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '✈️'}
      </div>
      <div className="message-content">
        {formatContent(message.content)}
        {message.metadata?.preferencesUpdated && (
          <div className="preference-update-badge">
            ✓ Profile updated: {message.metadata.preferencesUpdated.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};
