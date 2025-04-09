import { Link } from "react-router-dom";
import { CARD_DATA } from "../../Models/PageModel";

function Card(props: CARD_DATA) {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <Link to="#" className="card-body-title">
            {props.title.text}
          </Link>
          <h3>{props.text}</h3>
          <div style={{ fontSize: "42px" }}>
            <i className="bi bi-graph-up-arrow"></i>
          </div>
        </div>
      </div>
    </>
  );
}
export default Card;
