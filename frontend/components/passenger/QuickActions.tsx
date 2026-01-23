'use client';

interface QuickActionsProps {
  onLostFound: () => void;
}

const actions = [
  {
    id: 'lost-found',
    title: 'Lost & Found',
    subtitle: 'Verlust sofort melden',
    icon: '🧳',
    gradient: 'from-sbb-red to-[#FF6B6B]',
    primary: true,
  },
  {
    id: 'tickets',
    title: 'Tickets kaufen',
    subtitle: 'Schneller Ticketkauf',
    icon: '🎫',
    gradient: 'from-[#2196F3] to-[#64B5F6]',
  },
  {
    id: 'tracking',
    title: 'Live Tracking',
    subtitle: 'Reise verfolgen',
    icon: '📍',
    gradient: 'from-[#FF9800] to-[#FFB74D]',
  },
  {
    id: 'info',
    title: 'Reise-Info',
    subtitle: 'Verspätungen & Updates',
    icon: 'ℹ️',
    gradient: 'from-[#4CAF50] to-[#81C784]',
  },
];

export function QuickActions({ onLostFound }: QuickActionsProps) {
  const handleClick = (actionId: string) => {
    if (actionId === 'lost-found') {
      onLostFound();
    }
    // Other actions would navigate to respective pages
  };

  return (
    <section className="px-6 py-6">
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleClick(action.id)}
            className="card-sbb p-5 text-left touch-feedback group"
          >
            <div
              className={`
                w-12 h-12 rounded-sbb-md flex items-center justify-center text-2xl mb-3
                bg-gradient-to-br ${action.gradient}
              `}
            >
              {action.icon}
            </div>
            <h3 className="text-sbb-base font-semibold text-sbb-charcoal group-hover:text-sbb-red transition-colors">
              {action.title}
            </h3>
            <p className="text-sbb-sm text-sbb-granite mt-1">
              {action.subtitle}
            </p>
            {action.primary && (
              <span className="inline-block mt-2 text-sbb-xs text-sbb-red font-medium">
                Sofort-Benachrichtigung →
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
