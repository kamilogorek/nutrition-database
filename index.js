import React from "react";
import ReactDOM from "react-dom";
import { companies, dataset } from "./data";

const NO_DATA = "—";
const SEPARATOR = " / ";
const CORRECTNESS_THRESHOLD = 15;

function unify(input) {
  return input
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ż/g, "z")
    .replace(/ź/g, "z");
}

class Item extends React.Component {
  render() {
    const {
      company,
      name,
      weight,
      calories,
      macros: { protein, fat, carbs }
    } = this.props.data;

    const hasMissingMacro = protein === null || fat === null || carbs === null;
    const caloriesFromMacros = hasMissingMacro ? NO_DATA : Math.round(protein * 4 + fat * 9 + carbs * 4);
    const caloriesPerPortion = weight.map(weight => Math.round(calories * (weight / 100))).join(SEPARATOR);
    const caloriesFromMacrosPerPortion = hasMissingMacro
      ? NO_DATA
      : weight.map(weight => Math.round(caloriesFromMacros * (weight / 100))).join(SEPARATOR);
    const hasIncorrectMacros =
      caloriesFromMacros < calories - CORRECTNESS_THRESHOLD || caloriesFromMacros > calories + CORRECTNESS_THRESHOLD;

    return (
      <tr className={hasIncorrectMacros ? "incorrect-macros" : ""}>
        <td>{company}</td>
        <td>{name}</td>
        <td>{weight.map(w => Math.round(w)).join(SEPARATOR) || NO_DATA}</td>
        <td>{protein === null ? NO_DATA : Math.round(protein * 10) / 10}</td>
        <td>{fat === null ? NO_DATA : Math.round(fat * 10) / 10}</td>
        <td>{carbs === null ? NO_DATA : Math.round(carbs * 10) / 10}</td>
        <td>{calories === null ? NO_DATA : Math.round(calories)}</td>
        <td>{caloriesFromMacros}</td>
        <td>{caloriesPerPortion || NO_DATA}</td>
        <td>{caloriesFromMacrosPerPortion || NO_DATA}</td>
      </tr>
    );
  }
}

class NoItems extends React.Component {
  render() {
    return (
      <tr>
        <td colSpan="10">No matched items</td>
      </tr>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter: "" };
  }

  onInput(ev) {
    this.setState({ filter: ev.target.value });
  }

  render() {
    const items = dataset.filter(item =>
      this.state.filter
        .split(" ")
        .every(word => unify(item.name).includes(unify(word)) || unify(item.company).includes(unify(word)))
    );
    return (
      <div>
        <h1 className="title">Nutrition Database</h1>
        <h2 className="subtitle">
          <strong>Available datasets:</strong> {Object.keys(companies).join(", ")}
        </h2>
        <section>
          <p>
            - <i>C - calories</i>
          </p>
          <p>
            - <i>CC - calculated calories</i>
          </p>
          <p>
            - <i>CPP - calories per portion</i>
          </p>
          <p>
            - <i>CCPP - calculated calories per portion</i>
          </p>
          <p>- items that are missing weight, are already showing per-portion data</p>
          <p>- items marked as yellow has a large difference between declared and calculated calories amount</p>
        </section>
        <input
          autofocus="true"
          className="input is-medium"
          placeholder="Filter"
          type="text"
          value={this.state.value}
          onInput={e => this.onInput(e)}
        />
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Company</th>
              <th>Name</th>
              <th>Weight/g</th>
              <th>Protein/g</th>
              <th>Fat/g</th>
              <th>Carbs/g</th>
              <th>C/kcal</th>
              <th>CC/kcal</th>
              <th>CPP/kcal</th>
              <th>CCPP/kcal</th>
            </tr>
          </thead>

          <tbody>{items.length ? items.map((item, i) => <Item data={item} key={i} />) : <NoItems />}</tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
