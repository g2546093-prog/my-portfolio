document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 作品情報（CSV）
    // ==========================================

    const worksGrid = document.getElementById("works-grid");
    const categorySelect = document.getElementById("category");
    const sortSelect = document.getElementById("sort");

    let works = [];


    // CSVファイルを読み込む
    fetch("./works.csv")

        .then(function (response) {

            if (!response.ok) {
                throw new Error("CSVの読み込みに失敗しました");
            }

            return response.text();

        })

        .then(function (data) {

            // CSVを1行ずつに分ける
            const rows = data.trim().split(/\r?\n/);

            // 1行目の見出しを削除
            rows.shift();


            // CSVデータを作品情報に変換
            works = rows.map(function (row) {

                const columns = row.split(",");

                return {

                    title: columns[0],
                    description: columns[1],
                    category: columns[2],
                    year: Number(columns[3]),
                    image: columns[4]

                };

            });


            // 作品を表示
            displayWorks();

        })

        .catch(function (error) {

            console.error(error);

            worksGrid.textContent =
                "作品情報を読み込めませんでした。";

        });



    // ==========================================
    // 作品を表示する関数
    // ==========================================

    function displayWorks() {

        // 一度表示を空にする
        worksGrid.innerHTML = "";


        const selectedCategory =
            categorySelect.value;

        const selectedSort =
            sortSelect.value;



        // ======================================
        // カテゴリで絞り込み
        // ======================================

        let result = works.filter(function (work) {

            // Allの場合は全部表示
            if (selectedCategory === "all") {

                return true;

            }

            return work.category === selectedCategory;

        });



        // ======================================
        // 年で並び替え
        // ======================================

        result.sort(function (a, b) {

            // 新しい順
            if (selectedSort === "new") {

                return b.year - a.year;

            }

            // 古い順
            else {

                return a.year - b.year;

            }

        });



        // ======================================
        // 作品カードを作る
        // ======================================

        result.forEach(function (work) {


            // カード
            const card =
                document.createElement("div");

            card.className =
                "portfolio-work";



            // 画像
            const image =
                document.createElement("img");

            image.src =
                "./media/" + work.image;

            image.alt =
                work.title;



            // タイトル
            const title =
                document.createElement("h3");

            title.textContent =
                work.title;



            // 説明
            const description =
                document.createElement("p");

            description.textContent =
                work.description;



            // カテゴリ・年
            const info =
                document.createElement("span");

            info.textContent =
                work.category +
                " / " +
                work.year;



            // カードに追加
            card.appendChild(image);

            card.appendChild(title);

            card.appendChild(description);

            card.appendChild(info);



            // ページに追加
            worksGrid.appendChild(card);

        });

    }



    // ==========================================
    // Categoryを変更したとき
    // ==========================================

    categorySelect.addEventListener(
        "change",
        displayWorks
    );



    // ==========================================
    // Sortを変更したとき
    // ==========================================

    sortSelect.addEventListener(
        "change",
        displayWorks
    );



    // ==========================================
    // 天気API
    // ==========================================

    // 東京都市大学 横浜キャンパス付近
    const latitude = 35.6895;
    const longitude = 139.6917;


    // Open-Meteo APIのURL
    const weatherUrl =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + latitude +
        "&longitude=" + longitude +
        "&current=temperature_2m,weather_code" +
        "&timezone=Asia%2FTokyo";



    // ==========================================
    // 天気情報を取得
    // ==========================================

    fetch(weatherUrl)

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "天気情報の取得に失敗しました"
                );

            }

            // JSON形式に変換
            return response.json();

        })

        .then(function (data) {


            // weather_codeを取得
            const weatherCode =
                data.current.weather_code;


            // 気温を取得
            const temperature =
                data.current.temperature_2m;


            // 天気を表示
            showWeather(
                weatherCode,
                temperature
            );

        })

        .catch(function (error) {

            console.error(error);


            const weatherText =
                document.getElementById(
                    "weather-text"
                );


            if (weatherText) {

                weatherText.textContent =
                    "天気情報を取得できませんでした";

            }

        });



    // ==========================================
    // 天気を表示する関数
    // ==========================================

    function showWeather(code, temperature) {


        const icon =
            document.getElementById(
                "weather-icon"
            );


        const text =
            document.getElementById(
                "weather-text"
            );


        // HTMLに天気表示部分がない場合
        if (!icon || !text) {

            return;

        }



        // ======================================
        // 晴れ
        // ======================================

        if (code === 0) {


            icon.textContent = "☀️";


            text.textContent =
                "晴れ / " +
                temperature +
                "℃";


            document.body.classList.add(
                "weather-sunny"
            );

        }



        // ======================================
        // 曇り
        // ======================================

        else if (
            code >= 1 &&
            code <= 3
        ) {


            icon.textContent = "☁️";


            text.textContent =
                "曇り / " +
                temperature +
                "℃";


            document.body.classList.add(
                "weather-cloudy"
            );

        }



        // ======================================
        // 雨
        // ======================================

        else if (
            code >= 51 &&
            code <= 67
        ) {


            icon.textContent = "🌧️";


            text.textContent =
                "雨 / " +
                temperature +
                "℃";


            document.body.classList.add(
                "weather-rainy"
            );

        }



        // ======================================
        // その他の天気
        // ======================================

        else {


            icon.textContent = "🌤️";


            text.textContent =
                "現在 " +
                temperature +
                "℃";


            document.body.classList.add(
                "weather-other"
            );

        }

    }

});