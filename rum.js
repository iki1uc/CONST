// rum.js
// Minimal Room loader module for WELT
export function listRooms(){
  return ['DE.room','EN.room','TR.room'];
}

export function loadRoomByKey(key){
  // simple in‑module dataset; replace with fetch/import for real files
  const ROOMS = {
    'DE.room': { language:'DE', name:'Deutschland Room', pos:{x:120,y:34,z:6}, qsxi:{tokio:{x:10,y:-5},corlu:{x:-30,y:20},hh:{x:0,y:0}}, singular:{s:{radius:42}}, tmpEnergy:3 },
    'EN.room': { language:'EN', name:'English Room', pos:{x:-40,y:80,z:1}, qsxi:{tokio:{x:3,y:6},corlu:{x:10,y:-9},hh:{x:2,y:2}}, singular:{s:{radius:12}}, tmpEnergy:1.2 },
    'TR.room': { language:'TR', name:'Türkiye Room', pos:{x:7,y:-60,z:2}, qsxi:{tokio:{x:6,y:-2},corlu:{x:-8,y:22},hh:{x:3,y:-1}}, singular:{s:{radius:18}}, tmpEnergy:0.8 }
  };
  return ROOMS[key] || null;
}

// convenience: returns a room by language code
export function loadRoom(lang){
  const key = (lang === 'DE') ? 'DE.room' : (lang === 'EN') ? 'EN.room' : (lang === 'TR') ? 'TR.room' : 'DE.room';
  return loadRoomByKey(key);
}

// optional async loader for future dynamic import/fetch
export async function loadRoomAsync(lang){
  // placeholder: in future, import(`./rooms/${lang}.room.js`)
  return loadRoom(lang);
}

export default { listRooms, loadRoom, loadRoomByKey, loadRoomAsync };
