import { useState, useEffect } from "react";
import "./App.css";

function SaveButton(props) {
  const [saved, setSaved] = useState(false);
  function handleClick() {
    setSaved(true);
    props.onSave();
  }
  return (
    <button className="button" onClick={handleClick}>
      {saved ? "Saved!" : "Save Player"}
    </button>
  );
}

function PlayerCard(props) {
  return (
    <div className="Player-card">
      <h2>{props.name}</h2>
      <img src={props.image} alt={props.name} />
      <p><b>Team:</b> {props.team}</p>
      <p><b>Position:</b> {props.position}</p>
      <p><b>Nationality:</b> {props.nationality}</p>
      <p><b>Age:</b> {props.age}</p>
      <p><b>Height:</b> {props.height}</p>
      <p><b>Appearances:</b> {props.appearances}</p>
      <SaveButton onSave={props.onSave} />
    </div>
  );
}

function Search() {
  const [name, setName] = useState("messi");
  const [image, setImage] = useState("");
  const [team, setTeam] = useState("");
  const [position, setPosition] = useState("");
  const [nationality, setNationality] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [appearances, setAppearances] = useState("");
  const [favorites, setFavorites] = useState([]);
  async function fetchPlayer() {
    try {
      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${name}`
      );

      const data = await response.json();
      if (!data.player) throw new Error("Player not found");

      const p = data.player[0];

      setImage(p.strCutout || p.strThumb || "https://via.placeholder.com/250");
      setTeam(p.strTeam || "N/A");
      setPosition(p.strPosition || "N/A");
      setNationality(p.strNationality || "N/A");
      setAge(p.intBornYear ? `${2025 - p.intBornYear}` : "N/A");
      setHeight(p.strHeight || "N/A");
      setAppearances(p.intAppearances || "N/A");

    } catch (error) {
      console.error(error);
      setImage("");
      setTeam("Not found");
      setPosition("");
      setNationality("");
      setAge("");
      setHeight("");
      setAppearances("");
    }
  }

  useEffect(() => {
    fetchPlayer();
  }, []);

  function handleSave() {
    const playerData = {
      name,
      image,
      team,
      position,
      nationality,
      age,
      height,
      appearances
    };

    setFavorites((prev) => [...prev, playerData]);
  }

  return (
    <div>
      <h1>Soccer Player Search</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter soccer player"
      />
      <button onClick={fetchPlayer}>Search</button>
      {image && (
        <PlayerCard
          name={name}
          image={image}
          team={team}
          position={position}
          nationality={nationality}
          age={age}
          height={height}
          appearances={appearances}
          onSave={handleSave}
        />
      )}

      <h2>Favorites</h2>

      <div className="Favorites-container">
        {favorites.map((p, index) => (
          <div className="Favorite-card" key={index}>
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p><b>Team:</b> {p.team}</p>
            <p><b>Position:</b> {p.position}</p>
            <p><b>Age:</b> {p.age}</p>
            <p><b>Height:</b> {p.height}</p>
            <p><b>Appearances:</b> {p.appearances}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Search />
      </header>
    </div>
  );
}

export default App;
