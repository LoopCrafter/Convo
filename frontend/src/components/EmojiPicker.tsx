import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Smile,
  Coffee,
  Plane,
  Activity,
  Lightbulb,
  Heart,
  Flag,
} from "lucide-react";

import emojisData from "../lib/data-by-emoji.json";

const groupIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Smileys & Emotion": Smile,
  "People & Body": Heart,
  "Animals & Nature": Coffee,
  "Food & Drink": Coffee,
  "Travel & Places": Plane,
  Activities: Activity,
  Objects: Lightbulb,
  Symbols: Heart,
  Flags: Flag,
};

const emojiCategories = Object.entries(emojisData).reduce(
  (acc, [emoji, data]) => {
    const { group } = data;
    if (!acc[group]) {
      acc[group] = {
        icon: groupIcons[group] || Heart,
        label: group,
        emojis: [],
      };
    }
    acc[group].emojis.push({ emoji, name: data.name });
    return acc;
  },
  {} as Record<
    string,
    {
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      emojis: Array<{ emoji: string; name: string }>;
    }
  >
);

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  show: boolean;
}

export const EmojiPicker = ({
  onEmojiSelect,
  onClose,
  show,
}: EmojiPickerProps) => {
  const defaultCategory = Object.keys(
    emojiCategories
  )[0] as keyof typeof emojiCategories;
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof emojiCategories>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentEmojis");
    return saved ? JSON.parse(saved) : ["😊", "❤️", "👍", "😂", "🎉"];
  });

  const allEmojis = useMemo(
    () => Object.values(emojiCategories).flatMap((cat) => cat.emojis),
    []
  );

  const filteredEmojis = useMemo(() => {
    if (!searchQuery) {
      return emojiCategories[activeCategory].emojis;
    }
    const q = searchQuery.toLowerCase();
    return allEmojis.filter(
      ({ emoji, name }) => emoji.includes(q) || name.toLowerCase().includes(q)
    );
  }, [searchQuery, activeCategory, allEmojis]);
  useEffect(() => {
    localStorage.setItem("recentEmojis", JSON.stringify(recentEmojis));
  }, [recentEmojis]);

  const updateRecent = (emoji: string) => {
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(
      0,
      8
    );
    setRecentEmojis(updated);
  };

  const handleEmojiSelect = (e: React.MouseEvent, emoji: string) => {
    e.preventDefault();
    e.stopPropagation();
    onEmojiSelect(emoji);
    updateRecent(emoji);
    setTimeout(() => onClose(), 0);
  };

  const noResults = filteredEmojis.length === 0 && searchQuery;

  return (
    <div
      className={`absolute bg-base-100 emoji-picker bottom-full left-0 mb-2 w-full max-w-[340px] bg-card rounded-2xl shadow-xl border border-border overflow-hidden animate-in slide-in-from-bottom-2 duration-200 ${
        show ? "visible" : "hidden"
      }`}
    >
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search emoji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
      </div>
      {!searchQuery && recentEmojis.length > 0 && (
        <div className="p-3 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Recently Used
          </p>
          <div className="grid grid-cols-8 gap-1">
            {recentEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={(e) => handleEmojiSelect(e, emoji)}
                className="text-2xl p-1 hover:bg-muted rounded-md transition-colors"
                aria-label={`Select ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="h-[180px] overflow-y-auto p-3 scrollbar-thin">
        {noResults ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <span className="text-4xl mb-2">😕</span>
            <p className="text-sm">No emojis found</p>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis.map(({ emoji }) => (
              <button
                key={emoji}
                type="button"
                onClick={(e) => handleEmojiSelect(e, emoji)}
                className="text-2xl p-1 hover:bg-muted rounded-md transition-all hover:scale-110 active:scale-95"
                aria-label={`Select ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      {!searchQuery && (
        <div className="flex items-center justify-around p-2 border-t border-border bg-muted/30 overflow-x-auto">
          {Object.entries(emojiCategories).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setActiveCategory(key as keyof typeof emojiCategories)
                }
                className={`p-2 rounded-lg transition-all hover:bg-background
                    ${
                      activeCategory === key
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                title={category.label}
                aria-label={category.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
