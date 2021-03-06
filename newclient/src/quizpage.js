import React, { Component } from "react";
import quizQuestions from "./api/quizQuestions";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import logo from "./img/logo.png";
import "./quizpage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

class QuizPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: "",
      answerOptions: [],
      answer: "",
      answersCount: {},
      result: "",
      chosenAnswer: []
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentDidMount() {
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
    // this.radioRef = React.createRef();
  }

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: (state.answersCount[answer] || 0) + 1
      },
      answer: answer
    }));
    //alert(answer);
  }

  setNextQuestion() {
    if (this.state.counter < quizQuestions.length - 1) {
      const counter = this.state.counter + 1;
      const questionId = this.state.questionId + 1;

      this.setState({
        counter: counter,
        questionId: questionId,
        question: quizQuestions[counter].question,
        answerOptions: quizQuestions[counter].answers,
        answer: ""
      });
    } else {
      console.log("The end");
    }
  }

  /*need to flesh out this function and test it*/

  goBack() {
    if (this.state.counter > 0) {
      const counter = this.state.counter - 1;
      const questionId = this.state.questionId - 1;

      this.setState({
        counter: counter,
        questionId: questionId,
        question: quizQuestions[counter].question,
        answerOptions: quizQuestions[counter].answers,
        answer: ""
      });
    }
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map(key => answersCount[key]);
    let correctStill = false;
    //const maxAnswerCount = Math.max.apply(null, answersCountValues);
    const correctVal = answersCountKeys.filter(key => answersCount[key]);
    let correctAns = 0;
    alert(correctVal);
    var i;
    alert(answersCount + " " + answersCountKeys + " " + answersCountValues);
    for (i = 0; i < quizQuestions.length; i++) {
      alert(answersCountKeys[i]);
      if (answersCountKeys[i] === "true") {
        ++correctAns;
        correctStill = true;
      } else if (correctStill && answersCountKeys[i] === undefined) {
        return 1;
      } else {
        correctStill = false;
      }
    }
    //need to change to results meaningful to a math quiz

    return correctAns / quizQuestions.length;

    //alert(correctAns + " " + totalRight + " " + quizQuestions.length);
    //return answersCountKeys.filter(key => answersCount[key] === maxAnswerCount);
  }

  setResults(result) {
    /*if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: "Undetermined" });
    }*/
    this.setState({ result: `${this.getResults() * 100}%` });
  }

  renderQuiz() {
    return (
      <div>
        <Quiz
          answer={this.state.answer}
          counter={this.state.counter}
          answerOptions={this.state.answerOptions}
          questionId={this.state.questionId}
          question={this.state.question}
          questionTotal={quizQuestions.length}
          onAnswerSelected={this.handleAnswerSelected}
        />

        <div id="navigation">
          <span id="back">
            <Button
              className="float-left"
              variant="secondary"
              size="lg"
              disabled={this.disableBack()}
              onClick={() => this.goBack(this)}
            >
              Back
            </Button>
          </span>
          <span id="next">
            <Button
              className="float-right"
              variant="secondary"
              size="lg"
              disabled={this.disableNext()}
              onClick={() => this.setNextQuestion(this)}
            >
              Next
            </Button>
          </span>
        </div>
      </div>
    );
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }

  disableBack() {
    //if counter is at zero disable the back button
    if (this.state.counter === 0) {
      return true;
    } else {
      return false;
    }
  }

  disableNext() {
    //if counter is at the border disable the next button
    if (this.state.counter === quizQuestions.length - 1) {
      return true;
    } else {
      return false;
    }
  }

  //quit the quiz and go back to dashboard and save results
  quit() {
    window.location.href = '/dashboard';
  }

  getAnswer() {
    /*const ans = [];
    for(const [counter,quizQuestions[this.counter].answers] of quizQuestions[this.counter].answers === "true"){
      ans.push(quizQuestions[this.counter].answer);
    }*/
    alert(this.chosenAnswer);
  }

  getAnswerEvent() {
    try {
      var ans = quizQuestions[this.counter].answer;
      if (ans === undefined) {
        console.log("this is undefined");
        alert(ans);
      } else {
        return ans;
      }
    } catch (error) {
      alert("This is the Answer");
    }
  }

  render() {
    return (
      <div className="App">
        <div className="background">
          <header>
            <div className="header-logo">
              <img src={logo} alt="logo" height="75%" width="35%" />
            </div>
            <div className="quitButton">
              <Button
                id="quitButton"
                className="float-right"
                variant="danger"
                size="lg"
                onClick={this.quit}
              >
                Quit
              </Button>
            </div>
          </header>

          <div className="quiz-box">
            {this.state.result ? this.renderResult() : this.renderQuiz()}
          </div>
        </div>
      </div>
    );
  }
}

export default QuizPage;
