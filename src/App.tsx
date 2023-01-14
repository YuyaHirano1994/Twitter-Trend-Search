import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [searchWord, setSearchWord] = useState("");

  const createUrl = (searchWord: string) => {
    const api = "https://xzvrefmkp4.execute-api.ap-northeast-1.amazonaws.com/dev/twitter?query=";
    let urlAPI = api.concat(searchWord);
    console.log(urlAPI);
    return urlAPI;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //名前が保存されたか確認するlog
    getTweetCount(searchWord);
  };

  const handleChangeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSearchWord(e.target.value);
    }
  };

  const getTweetCount = async (searchWord: string) => {
    try {
      const awsAPI = createUrl(searchWord);
      const res = await axios.get(awsAPI);
      console.log(res.data.data[0].tweet_count); //read specific data
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <h1>Hello world!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          keyword:
          {/* inputタグに、入力された値を保存する関数を書く */}
          <input type="text" name="keyword" value={searchWord} onChange={handleChangeWord} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
