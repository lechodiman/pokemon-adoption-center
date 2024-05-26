import { onRequest } from 'firebase-functions/v2/https';
import { firestore } from 'firebase-functions';
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

app.get('/adoption-request/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const adoptionRequestRef = db.collection('adoptionRequests').doc(id);
    const adoptionRequest = await adoptionRequestRef.get();

    if (!adoptionRequest.exists) {
      res.status(404).send('Adoption request not found');
      return;
    }

    res.json({ id: adoptionRequest.id, ...adoptionRequest.data() });
  } catch (error) {
    logger.error('Error getting adoption request:', error);
    res.status(500).send('Error getting adoption request');
  }
});

export const api = onRequest(app);

const MAX_TRANSPORTATION_TIME_MINUTES = 3;
const MIN_TRANSPORTATION_TIME_MINUTES = 1;

function getRandomTimeInMilliseconds(minMinutes: number, maxMinutes: number): number {
  const MINUTES_TO_MILLISECONDS = 60 * 1000;
  const randomMinutes = Math.random() * (maxMinutes - minMinutes);
  return (randomMinutes + minMinutes) * MINUTES_TO_MILLISECONDS;
}

export const onAdoptionRequestCreated = firestore
  .document('adoptionRequests/{adoptionRequestID}')
  .onCreate(async (snapshot, context) => {
    const adoptionRequestId = context.params.adoptionRequestID;
    const adoptionRequestRef = db.collection('adoptionRequests').doc(adoptionRequestId);

    const pokemonRef = db.collection('pokemon').doc(snapshot.data().pokemonID);

    logger.info(`New adoption request created with id: ${adoptionRequestId}`);

    setTimeout(async () => {
      logger.info(
        `Changing status to 'transportation' for adoption request id: ${adoptionRequestId}`
      );
      await adoptionRequestRef.update({ status: 'transportation' });

      // After 1-3 minutes, decide if the adoption is successful
      const transportationTime = getRandomTimeInMilliseconds(
        MIN_TRANSPORTATION_TIME_MINUTES,
        MAX_TRANSPORTATION_TIME_MINUTES
      );

      setTimeout(async () => {
        const isSuccess = Math.random() < 0.95;
        const newStatus = isSuccess ? 'success' : 'failure';

        logger.info(
          `Changing status to '${newStatus}' for adoption request id: ${adoptionRequestId}`
        );

        await adoptionRequestRef.update({ status: newStatus });

        if (!isSuccess) {
          logger.info(`Making pokemon id: ${snapshot.data().pokemonID} available again`);
          await pokemonRef.update({ available: true });
        }
      }, transportationTime);
    }, 60 * 1000);
  });
