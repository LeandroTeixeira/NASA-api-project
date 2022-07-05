const API_URL ='http://localhost:8000';

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const response = await fetch(`${API_URL}/planets`);
  const data = await response.json();
  console.log(data);
  return data;
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  console.log(fetchedLaunches);
  return fetchedLaunches.sort((a,b) => {
    return a.flightNumber - b.flightNumber;
  });}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
try {
  const response = await fetch(`${API_URL}/launches`, {
    method:"post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(launch),
  });
  return response;
}catch(err) {
  return {ok: false};
}
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
