
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

interface RoboticsVisualizerProps {
  type: 'joint' | 'torque' | 'zmp';
  title: string;
}

const generateMockData = (type: string) => {
  const data = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 10;
    if (type === 'joint') {
      data.push({
        time: t,
        Hip: Math.sin(t * 2) * 30 + 10,
        Knee: Math.sin(t * 2 - 0.5) * 60 + 20,
        Ankle: Math.cos(t * 2) * 15
      });
    } else if (type === 'torque') {
      data.push({
        time: t,
        Torque: Math.sin(t * 5) * 100 + (Math.random() * 10),
        Limit: 120
      });
    } else {
      data.push({
        time: t,
        ZMP_x: Math.sin(t * 3) * 0.05,
        Support_Max: 0.1,
        Support_Min: -0.1
      });
    }
  }
  return data;
};

const RoboticsVisualizer: React.FC<RoboticsVisualizerProps> = ({ type, title }) => {
  const data = generateMockData(type);

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl p-4 my-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h4>
        <div className="flex gap-2">
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500">Live Simulation Data</span>
        </div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'joint' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="time" stroke="#555" fontSize={10} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#555' }} />
              <YAxis stroke="#555" fontSize={10} label={{ value: 'Angle (deg)', angle: -90, position: 'insideLeft', fill: '#555' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Line type="monotone" dataKey="Hip" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Knee" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Ankle" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="time" stroke="#555" fontSize={10} />
              <YAxis stroke="#555" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} />
              <Area type="monotone" dataKey={type === 'torque' ? 'Torque' : 'ZMP_x'} stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
              {type === 'torque' && <Line type="step" dataKey="Limit" stroke="#ef4444" strokeDasharray="5 5" />}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoboticsVisualizer;
