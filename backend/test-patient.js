const s = require('./src/config');
const { getRendezVousPatient } = require('./src/controllers/rendezVousController');
const { getHistorique, getOrdonnances } = require('./src/controllers/patientController');
const { getAllFeedbacks } = require('./src/controllers/feedbackController');

const mockReq = (params = {}, query = {}) => ({
  user: { id: 4, role: 'patient' },
  params,
  query
});

const mockRes = {
  status(code) {
    this.code = code;
    return this;
  },
  json(data) {
    console.log('SUCCESS:', data);
  }
};

async function test() {
  console.log('--- Testing getRendezVousPatient (upcoming) ---');
  await getRendezVousPatient(mockReq({ id: '4' }, { upcoming: '1' }), mockRes).catch(console.error);

  console.log('--- Testing getRendezVousPatient (all) ---');
  await getRendezVousPatient(mockReq({ id: '4' }), mockRes).catch(console.error);

  console.log('--- Testing getHistorique ---');
  await getHistorique(mockReq(), mockRes).catch(console.error);

  console.log('--- Testing getOrdonnances ---');
  await getOrdonnances(mockReq({ id: '4' }), mockRes).catch(console.error);

  console.log('--- Testing getAllFeedbacks ---');
  await getAllFeedbacks(mockReq({ id: '4' }), mockRes).catch(console.error);

  process.exit(0);
}

test();
