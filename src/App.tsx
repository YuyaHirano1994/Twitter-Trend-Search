import React, { useState } from "react";
import axios from "axios";
import { tweetData } from "./types";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import "./App.css";

function App() {
  const pStyle = {
    color: "pink",
  };

  const divStyle = {
    background: "black",
    fontWeight: "bold",
    border: "solid 2px blue",
  };

  const [searchWord, setSearchWord] = useState("");
  const [tweetDataList, setTweetDataList] = useState<tweetData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string[]>([]);

  const createUrl = (searchWord: string) => {
    const api = process.env.REACT_APP_API_URL;
    let urlAPI = encodeURI(`${api}${searchWord}`);

    console.log(urlAPI);

    return urlAPI;
  };

  console.log(tweetDataList);

  const getTweetCount = async (searchWord: string) => {
    try {
      const awsAPI = createUrl(searchWord);
      const res = await axios.get(awsAPI);
      let tweetList = res.data.data.slice(0, 7);
      tweetList = updateDateType(tweetList);
      setTweetDataList(tweetList);
      setErrorMsg([]);
      return res.data;
    } catch (error) {
      setTweetDataList([]);
      setErrorMsg(["cannot find Data. Please tyr another keyword"]);
    }
  };

  const updateDateType = (arr: [tweetData]) => {
    const newTweetList = arr.map((tweetData) => {
      let ts = Date.parse(tweetData.start);
      let newDate: Date = new Date(ts); // Mon Jan 09 2023 16:00:00 GMT-0800 (Pacific Standard Time) の形に生成されう

      let Month: number = newDate.getUTCMonth() + 1;
      let Day: number = newDate.getDate();
      let editStartDate = Month.toString() + "/" + Day.toString();

      return { start: editStartDate, end: tweetData.end, tweet_count: tweetData.tweet_count };
    });

    return newTweetList;
  };

  const checkSearchWord = (searchWord: string) => {
    // eslint-disable-next-line no-useless-escape
    const regax = new RegExp(/[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^`{|}~]/);
    if (regax.test(searchWord)) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 入力チェック
    if (checkSearchWord(searchWord)) {
      const tweetCountList = getTweetCount(searchWord);
    } else {
      setTweetDataList([]);
      setErrorMsg(["keyword is something wrong.", "Do not use special characters at the beginning of keywords."]);
    }
  };

  const handleChangeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSearchWord(e.target.value);
    }
  };

  return (
    <div className="bg-black text-white h-screen w-full ">
      <h1 className="pt-8 text-3xl font-bold underline table-fixed text-green-500 block text-center ">Trend Search!</h1>
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className="p-8">
          <label>
            <p className="mr-4 mb-4">
              Enter a keyword of your choice and <br></br>see a graph of the number of tweets for the past week.
            </p>
            <div className="flex items-center justify-center">
              <input
                className="text-black text-center w-1/2 rounded-lg"
                type="text"
                name="keyword"
                placeholder="keyword"
                onChange={handleChangeWord}
                required
              />
            </div>
          </label>
          <div className="flex items-center justify-center ">
            <input
              className="w-1/3 h-8 mt-4 bg-blue-500 hover:bg-blue-800 rounded-lg cursor-pointer"
              type="submit"
              value="Search!"
            />
          </div>
        </form>
      </div>
      <div className="text-center text-red-400 text-xl ">
        {errorMsg.map((msg, i) => (
          <div key={i}>
            <h2>{msg}</h2>
          </div>
        ))}
      </div>
      <div className="container flex justify-center mx-auto">
        <div className="flex flex-col">
          <div className="w-full">
            <div className="border-b border-gray-200 shadow">
              <table className="divide-y divide-gray-300 ">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs text-gray-500">Date</th>
                    <th className="px-4 py-2 text-xs text-gray-500">Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  <tr className="whitespace-nowrap" />
                  {tweetDataList.map((tweetData, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-sm text-gray-800"> {tweetData.start}</td>
                      <td className="px-6 py-4 text-gray-800">{tweetData.tweet_count} tweet</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="Chart ml-4">
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
            <Line type="monotone" dataKey="tweet_count" stroke="#fff700" strokeWidth={2} />
            {/* <Legend /> */}
            <Tooltip contentStyle={divStyle} labelStyle={pStyle} />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default App;
