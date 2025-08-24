// src/db/factories/user.factory.ts
import { Gender } from 'src/patients/entities/gender';
import { Patient } from 'src/patients/entities/patient.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Patient, (faker) => {
  const patient = new Patient();

      // Get all possible Gender values
      const genders = Object.values(Gender);
      // Pick a random gender
      patient.sex = genders[Math.floor(Math.random() * genders.length)];
  
      // Generate a random year_of_birth between 1901 and the previous year
      const currentYear = new Date().getFullYear();
      patient.year_of_birth  = (Math.floor(Math.random() * (currentYear - 1901)) + 1901).toString();

  return patient;
});
