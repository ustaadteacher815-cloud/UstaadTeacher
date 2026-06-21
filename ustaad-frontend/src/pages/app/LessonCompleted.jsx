import { Link, useLocation, Navigate } from "react-router-dom";

import { Row, Col, Button } from "react-bootstrap";

import AppLayout from "../../components/layouts/AppLayout";



function LessonCompleted() {

  const location = useLocation();

  const xpEarned = location.state?.xpEarned ?? 0;

  const coinsEarned = location.state?.coinsEarned ?? 0;



  if (location.state?.xpEarned === undefined) {

    return <Navigate to="/learning-path" replace />;

  }



  return (

    <AppLayout

      title="Lesson Completed! 🎉"

      backTo="/learning-path"

      backLabel="Back to Learning Path"

    >

      <div className="ustaad-card text-center" style={{ maxWidth: 480, margin: "0 auto" }}>

        <div style={{ fontSize: "4rem" }}>🏅</div>

        <h3 className="fw-bold">+{xpEarned} XP & +{coinsEarned} Coins</h3>

        <p className="text-muted mb-4">You&apos;ve completed this lesson!</p>



        <Row className="g-3 mb-4">

          <Col xs={4}>

            <div className="ustaad-stat-card">

              <div className="ustaad-stat-value">+{xpEarned}</div>

              <small>XP</small>

            </div>

          </Col>

          <Col xs={4}>

            <div className="ustaad-stat-card">

              <div className="ustaad-stat-value">+{coinsEarned}</div>

              <small>Coins</small>

            </div>

          </Col>

          <Col xs={4}>

            <div className="ustaad-stat-card">

              <div className="ustaad-stat-value">🏅</div>

              <small>Badge</small>

            </div>

          </Col>

        </Row>



        <Button as={Link} to="/streak" className="ustaad-btn-primary w-100 mb-2">

          UPDATE STREAK

        </Button>

        <Button as={Link} to="/leaderboard" className="ustaad-btn-secondary w-100">

          VIEW LEADERBOARD

        </Button>

      </div>

    </AppLayout>

  );

}



export default LessonCompleted;

