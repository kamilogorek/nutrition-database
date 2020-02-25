import { h, render, Component } from "preact";
import { bobbyburger, dagrasso, lajkonik, pasibus } from "./data";

const NO_DATA = "—";
const SEPARATOR = " / ";
const CORRECTNESS_THRESHOLD = 15;

const companies = {
  ["Bobby Burger"]: bobbyburger,
  ["DaGrasso"]: dagrasso,
  ["Lajkonik"]: lajkonik,
  ["Pasibus"]: pasibus
};

const dataset = Object.keys(companies)
  .map(company =>
    companies[company].map(v => ({
      company,
      ...v
    }))
  )
  .flat();

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

class Item extends Component {
  render() {
    const {
      company,
      name,
      weight,
      calories,
      macros: { protein, fat, carbs }
    } = this.props.data;

    const caloriesFromMacros = Math.round(protein * 4 + fat * 9 + carbs * 4);
    const caloriesPerPortion = weight.map(weight => Math.round(calories * (weight / 100)));
    const caloriesFromMacrosPerPortion = weight.map(weight => Math.round(caloriesFromMacros * (weight / 100)));
    const hasIncorrectMacros =
      caloriesFromMacros < calories - CORRECTNESS_THRESHOLD || caloriesFromMacros > calories + CORRECTNESS_THRESHOLD;

    return (
      <tr>
        <td>{company}</td>
        <td>{name}</td>
        <td>{weight.map(w => Math.round(w)).join(SEPARATOR) || NO_DATA}</td>
        <td>{Math.round(protein * 10) / 10}</td>
        <td>{Math.round(fat * 10) / 10}</td>
        <td>{Math.round(carbs * 10) / 10}</td>
        <td>{Math.round(calories)}</td>
        <td class={hasIncorrectMacros && "incorrect-macros"}>{caloriesFromMacros}</td>
        <td>{caloriesPerPortion.join(SEPARATOR) || NO_DATA}</td>
        <td>{caloriesFromMacrosPerPortion.join(SEPARATOR) || NO_DATA}</td>
      </tr>
    );
  }
}

class NoItems extends Component {
  render() {
    return (
      <tr>
        <td colspan="10">No matched items</td>
      </tr>
    );
  }
}

class App extends Component {
  state = { filter: "" };

  onInput = ev => {
    this.setState({ filter: ev.target.value });
  };

  render() {
    const items = dataset.filter(item =>
      this.state.filter
        .split(" ")
        .every(word => unify(item.name).includes(unify(word)) || unify(item.company).includes(unify(word)))
    );
    return (
      <div>
        <h1 class="title">Food Nutrition Database</h1>
        <h2 class="subtitle">
          <strong>Available datasets:</strong> {Object.keys(companies).join(", ")}
        </h2>
        <input
          class="input is-medium"
          placeholder="Filter"
          type="text"
          value={this.state.value}
          onInput={this.onInput}
        />
        <table class="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Company</th>
              <th>Name</th>
              <th>Weight</th>
              <th>Protein</th>
              <th>Fat</th>
              <th>Carbs</th>
              <th>Cals</th>
              <th>Cals FM</th>
              <th>Cals PP</th>
              <th>Cals FMPP</th>
            </tr>
          </thead>

          <tbody>{items.length ? items.map(item => <Item data={item} />) : <NoItems />}</tbody>
        </table>
      </div>
    );
  }
}

render(<App />, document.body);
