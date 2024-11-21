"use client";

import React from "react";
import Image from "next/image";

class Stat {
  private _title: string;
  private _value: string;
  private _color: string;
  private _icon: string;

  constructor(title: string, value: string, color: string, icon: string) {
    this._title = title;
    this._value = value;
    this._color = color;
    this._icon = icon;
  }

  get title(): string {
    return this._title;
  }

  get value(): string {
    return this._value;
  }

  get color(): string {
    return this._color;
  }

  get icon(): string {
    return this._icon;
  }
}

const stats: Stat[] = [
  new Stat("Accidents Attended", "5,423", "bg-green-100 text-green-700", "/Images/Icons/Health.png"),
  new Stat("New Accidents", "8", "bg-red-100 text-red-700", "/Images/Icons/Danger.png"),
  new Stat("People Connected", "189", "bg-blue-100 text-blue-700", "/Images/Icons/Monitor.png"),
];

interface StatsCardsProps {
  onStatClick: (page: string) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({ onStatClick }) => (
  <div className="grid grid-cols-3 gap-6 px-8 py-6">
    {stats.map((stat, index) => (
      <button
        key={index}
        className={`p-6 rounded-lg ${stat.color} shadow`}
        onClick={() => onStatClick(stat.title.replace(" ", ""))}
      >
        <div className="flex items-center space-x-4">
          <Image
            src={stat.icon}
            alt={stat.title}
            width={50}
            height={50}
            className="w-12 h-12"
          />
          <h3 className="text-lg font-semibold">{stat.title}</h3>
        </div>
        <p className="text-2xl font-bold mt-4">{stat.value}</p>
      </button>
    ))}
  </div>
);

export default StatsCards;
