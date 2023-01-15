import React, { useEffect, useState } from "react";
import axios from "axios";
import { tweetData } from "./types";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import "./App.css";

function App() {
  const [searchWord, setSearchWord] = useState("");

  const [tweetDataList, setTweetDataList] = useState<tweetData[]>([]);

  console.log(tweetDataList);

  const createUrl = (searchWord: string) => {
    const api = "https://xzvrefmkp4.execute-api.ap-northeast-1.amazonaws.com/dev/twitter?query=";
    let urlAPI = api.concat(searchWord);
    console.log(urlAPI);
    return urlAPI;
  };

  const getTweetCount = async (searchWord: string) => {
    try {
      const awsAPI = createUrl(searchWord);
      const res = await axios.get(awsAPI);
      let tweetList = res.data.data.slice(0, 7);
      tweetList = updateDateType(tweetList);
      setTweetDataList(tweetList);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateDateType = (arr: [tweetData]) => {
    const newTweetList = arr.map((tweetData) => {
      console.log(tweetData.start);
      let ts = Date.parse(tweetData.start);
      let newDate: Date = new Date(ts); // Mon Jan 09 2023 16:00:00 GMT-0800 (Pacific Standard Time) の形に生成されう

      console.log(newDate);
      let Month: number = newDate.getUTCMonth() + 1;
      let Day: number = newDate.getDate();
      let editDate = Month.toString() + "/" + Day.toString();
      console.log(editDate);
      return { start: editDate, end: tweetData.end, tweet_count: tweetData.tweet_count };
      // tweetData.start = editDate;
    });
    console.log(newTweetList);

    return newTweetList;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tweetCountList = getTweetCount(searchWord);
    console.log(tweetCountList);
  };

  const handleChangeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSearchWord(e.target.value);
    }
  };

  return (
    <div className="App">
      <h1>Hello Trend Search!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          keyword:
          {/* inputタグに、入力された値を保存する関数を書く */}
          <input type="text" name="keyword" value={searchWord} onChange={handleChangeWord} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <ul>
        {tweetDataList.map((tweetData, i) => (
          <li key={i}>{tweetData.tweet_count}</li>
        ))}
      </ul>
      <div className="Chart">
        <LineChart
          width={700}
          height={300}
          data={tweetDataList}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="start" />
          <YAxis dataKey="tweet_count" />
          <Line type="monotone" dataKey="tweet_count" stroke="#e7f54a" />
          <Legend />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
}

export default App;
