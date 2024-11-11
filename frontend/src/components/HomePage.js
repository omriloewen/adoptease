import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const HomePage = () => {
  return (
    <Container className="mt-5" dir="rtl">
      {/* Welcome Section */}
      <Row className="text-center mb-4">
        <Col>
          <h1>ברוכים הבאים ל-AdoptEase</h1>
          <p className="lead">
            הפלטפורמה של עמותת אדופט לארגון ימי האימוץ וניהול אתר העמותה.
          </p>
        </Col>
      </Row>

      {/* Highlighted Features Section */}
      <Row className="mb-4">
        <Col md={6} lg={4} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <img
              src="https://i.imgur.com/xwth1dJ.png"
              className="card-img-top"
              alt="עמוד ניהול כלבים"
              style={{ height: "150px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>צפייה בכלבים</Card.Title>

              <Card.Text>
                דפדוף בין הכלבים הזמינים לאימוץ ובדיקת סטטוסים.
              </Card.Text>
              <Button href="/view-dogs" variant="outline-primary">
                הצג כלבים
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <img
              src="https://i.imgur.com/ZeXI5SM.png"
              className="card-img-top"
              alt="עמוד ניהול כלבים"
              style={{ height: "150px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>ניהול ראיונות</Card.Title>
              <Card.Text>מעקב וניהול ראיונות למועמדים פוטנציאליים.</Card.Text>
              <Button href="/view-candidates" variant="outline-primary">
                נהל ראיונות
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <Card.Title>כתבות</Card.Title>
              <Card.Text>כתיבה ועריכת כתבות לאתר העמותה</Card.Text>
              <Button href="/settings" variant="outline-primary">
                עבור לכתבות
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Welcome Message Section */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center shadow-lg p-4">
            <Card.Body>
              <h3>שמח לראות אתכם כאן!</h3>
              <p>
                AdoptEase נוצרה כדי להקל על ניהול תהליך האימוץ והטיפול. אתם
                מוזמנים לגלות את הכלים המגוונים הזמינים כאן ולעזור ליצור חוויית
                אימוץ מהנה ואחראית.
              </p>
              <Button href="/view-dogs" variant="primary">
                התחל חיפוש כלב לאימוץ
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
