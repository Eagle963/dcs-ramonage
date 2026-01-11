// ===========================================
// API Route - Inscription (Création Organisation + Admin)
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { z } from 'zod';

// Schéma de validation
const registerSchema = z.object({
  companyName: z.string().min(2, 'Nom d\'entreprise trop court'),
  siret: z.string().optional(),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  firstName: z.string().min(2, 'Prénom trop court'),
  lastName: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

// Générer un slug unique à partir du nom d'entreprise
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, '') // Retirer les tirets en début/fin
    .substring(0, 50); // Limiter la longueur
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { companyName, siret, phone, firstName, lastName, email, password } = validation.data;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email' },
        { status: 400 }
      );
    }

    // Générer un slug unique
    let slug = generateSlug(companyName);
    let slugExists = await prisma.organization.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(companyName)}-${counter}`;
      slugExists = await prisma.organization.findUnique({ where: { slug } });
      counter++;
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Calculer la date de fin d'essai (14 jours)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    // Créer l'organisation et l'utilisateur admin en une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'organisation
      const organization = await tx.organization.create({
        data: {
          name: companyName,
          slug,
          siret: siret || null,
          phone,
          email,
          plan: 'SOLO',
          planStatus: 'TRIAL',
          trialEndsAt,
          settings: {
            timezone: 'Europe/Paris',
            currency: 'EUR',
            dateFormat: 'DD/MM/YYYY',
          },
        },
      });

      // Créer l'utilisateur admin
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
          role: 'ADMIN',
          organizationId: organization.id,
        },
      });

      return { organization, user };
    });

    // Log de la création
    console.log(`[Register] Nouvelle organisation créée: ${result.organization.name} (${result.organization.slug})`);

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
      },
    });
  } catch (error) {
    console.error('[Register] Erreur:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du compte' },
      { status: 500 }
    );
  }
}
