import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { db } from './db';
import * as express from 'express';
import * as cors from 'cors';

const app = express();

app.use(cors({ origin: true }));

app.get('/pokemon', async (req, res) => {
  try {
    const snapshot = await db.collection('pokemon').where('available', '==', true).get();
    const pokemons: FirebaseFirestore.DocumentData[] = [];
    snapshot.forEach((doc) => {
      pokemons.push({ id: doc.id, ...doc.data() });
    });
    res.json(pokemons);
  } catch (error) {
    logger.error('Error getting available Pokemon:', error);
    res.status(500).send('Error getting available Pokemon');
  }
});

app.post('/adoption-request', async (req, response) => {
  const { name, lastname, address, rut, description, pokemonID } = req.body;

  try {
    const pokemonRef = db.collection('pokemon').doc(pokemonID as string);
    const pokemon = await pokemonRef.get();
    if (!pokemon.exists) {
      response.status(404).send('Pokemon not found');
      return;
    }

    if (!pokemon.data()?.available) {
      response.status(409).send('Pokemon is not available');
      return;
    }

    const previousAdoptions = await db
      .collection('adoptionRequests')
      .where('rut', '==', rut)
      .where('status', '==', 'success')
      .get();

    const hasPreviousSuccess = !previousAdoptions.empty;

    const successProbability = hasPreviousSuccess ? 0.9 : 0.5;
    const willAdopt = Math.random() < successProbability;

    if (!willAdopt) {
      response.status(403).send('Adoption request rejected');
      return;
    }

    const newAdoptionRef = db.collection('adoptionRequests').doc();

    await db.runTransaction(async (t) => {
      t.set(newAdoptionRef, {
        name,
        lastname,
        address,
        rut,
        description,
        pokemonID,
        status: 'preparation',
      });

      t.update(pokemonRef, { available: false });
    });

    response.status(201).json({ adpotionId: newAdoptionRef.id });
  } catch (error) {
    logger.error('Error adopting Pokemon:', error);
    response.status(500).send('Error adopting Pokemon');
  }
});

export const api = onRequest(app);
