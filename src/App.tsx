import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // const urlAPI = "https://xzvrefmkp4.execute-api.ap-northeast-1.amazonaws.com/dev/twitter?query=chainsawman";

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
    console.log(searchWord);
    clickHandler(searchWord);
  };

  const handleChangeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const clickHandler = async (searchWord: string) => {
    try {
      let awsAPI = createUrl(searchWord);
      const res = await axios.get(awsAPI);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    console.log("hello");
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
