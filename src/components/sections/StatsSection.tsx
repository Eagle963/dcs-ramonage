import { siteConfig } from '@/config/site';

export function StatsSection() {
  return (
    <section className="py-12 bg-white relative z-10">
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {siteConfig.stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-primary-700 mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-secondary-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
