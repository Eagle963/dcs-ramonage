import { NextRequest, NextResponse } from 'next/server';

// Configuration
const MAX_SLOTS_MORNING = 5;
const MAX_SLOTS_AFTERNOON = 5;
const ORGANIZATION_ID = 'dcs-ramonage'; // Pour l'instant en dur

// Codes postaux desservis (Oise 60 + Val-d'Oise 95)
const VALID_POSTAL_CODES = [
  // Oise (60)
  '60000', '60100', '60110', '60120', '60130', '60140', '60150', '60155', '60157',
  '60160', '60170', '60180', '60190', '60200', '60210', '60220', '60230', '60240',
  '60250', '60260', '60270', '60280', '60290', '60300', '60310', '60320', '60330',
  '60340', '60350', '60360', '60370', '60380', '60390', '60400', '60410', '60420',
  '60430', '60440', '60450', '60460', '60470', '60480', '60490', '60500', '60510',
  '60520', '60530', '60540', '60550', '60560', '60570', '60580', '60590', '60600',
  '60610', '60620', '60630', '60640', '60650', '60660', '60670', '60680', '60690',
  '60700', '60710', '60720', '60730', '60740', '60750', '60760', '60770', '60780',
  '60790', '60800', '60810', '60820', '60830', '60840', '60850', '60860', '60870',
  '60880', '60890',
  // Val-d'Oise (95)
  '95000', '95100', '95110', '95120', '95130', '95140', '95150', '95160', '95170',
  '95180', '95190', '95200', '95210', '95220', '95230', '95240', '95250', '95260',
  '95270', '95280', '95290', '95300', '95310', '95320', '95330', '95340', '95350',
  '95360', '95370', '95380', '95390', '95400', '95410', '95420', '95430', '95440',
  '95450', '95460', '95470', '95480', '95490', '95500', '95510', '95520', '95530',
  '95540', '95550', '95560', '95570', '95580', '95590', '95600', '95610', '95620',
  '95630', '95640', '95650', '95660', '95670', '95680', '95690', '95700', '95710',
  '95720', '95730', '95740', '95750', '95760', '95770', '95780', '95790', '95800',
  '95810', '95820', '95830', '95840', '95850', '95860', '95870', '95880',
];

// Simulation de données (à remplacer par Prisma)
// En attendant la vraie BDD, on stocke en mémoire
const blockedDays: { date: string; slot: 'MORNING' | 'AFTERNOON' | null }[] = [];
const bookings: { date: string; slot: 'MORNING' | 'AFTERNOON'; status: string }[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); // Format: 2025-01
  const postalCode = searchParams.get('postalCode');

  // Vérification du code postal
  if (postalCode) {
    const isValidArea = VALID_POSTAL_CODES.includes(postalCode) || 
                        postalCode.startsWith('60') || 
                        postalCode.startsWith('95');
    
    if (!isValidArea) {
      return NextResponse.json({
        success: false,
        error: 'Zone non desservie',
        message: 'Désolé, nous n\'intervenons pas dans votre secteur. Notre zone d\'intervention couvre l\'Oise (60) et le Val-d\'Oise (95).',
      }, { status: 400 });
    }
  }

  // Calcul du mois à afficher
  const now = new Date();
  let year: number, monthNum: number;
  
  if (month) {
    [year, monthNum] = month.split('-').map(Number);
  } else {
    year = now.getFullYear();
    monthNum = now.getMonth() + 1;
  }

  // Générer les disponibilités pour le mois
  const firstDay = new Date(year, monthNum - 1, 1);
  const lastDay = new Date(year, monthNum, 0);
  
  const availability: {
    date: string;
    dayOfWeek: number;
    morning: { available: boolean; remaining: number };
    afternoon: { available: boolean; remaining: number };
    isPast: boolean;
    isToday: boolean;
  }[] = [];

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPast = d < new Date(now.toDateString());
    const isToday = d.toDateString() === now.toDateString();
    
    // Compter les réservations existantes pour ce jour
    const morningBookings = bookings.filter(
      b => b.date === dateStr && b.slot === 'MORNING' && b.status !== 'CANCELED'
    ).length;
    const afternoonBookings = bookings.filter(
      b => b.date === dateStr && b.slot === 'AFTERNOON' && b.status !== 'CANCELED'
    ).length;
    
    // Vérifier si le jour est bloqué
    const dayBlocked = blockedDays.find(b => b.date === dateStr && b.slot === null);
    const morningBlocked = blockedDays.find(b => b.date === dateStr && b.slot === 'MORNING');
    const afternoonBlocked = blockedDays.find(b => b.date === dateStr && b.slot === 'AFTERNOON');
    
    const morningRemaining = MAX_SLOTS_MORNING - morningBookings;
    const afternoonRemaining = MAX_SLOTS_AFTERNOON - afternoonBookings;
    
    availability.push({
      date: dateStr,
      dayOfWeek,
      morning: {
        available: !isWeekend && !isPast && !dayBlocked && !morningBlocked && morningRemaining > 0,
        remaining: morningRemaining,
      },
      afternoon: {
        available: !isWeekend && !isPast && !dayBlocked && !afternoonBlocked && afternoonRemaining > 0,
        remaining: afternoonRemaining,
      },
      isPast,
      isToday,
    });
  }

  return NextResponse.json({
    success: true,
    month: `${year}-${String(monthNum).padStart(2, '0')}`,
    availability,
  });
}
