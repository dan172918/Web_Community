# 畢業專題  Web_Community

## 開發環境與使用套件
    ∙ 伺服器 : Google Cloud Platform (GCP)
    ∙ 資料庫 : MySQL
    ∙ 後端 : Node.js、PM2、Apache
    ∙ 前端 : HTML、CSS、JavaScript(jQuery)、Bootstrap

## GCP 伺服器
    ∙ 帳號 : daniel9563769@gmail.com
    ∙ 地區 : 台灣
    ∙ 地址 : no display
    ∙ 信用卡 : no display
    ∙ 建立時間 : 2020/05/08 11:59 (試用期限至 2021/05/08)
    ∙ 專案名稱(專案ID) : Web Community
    ∙ Compute Engine VM
        * Name : daniel-918369
        * Region : us-west1-b (奧勒岡州)
        * Machine type : f1-micro (1 個 vCPU，614MB 記憶體)
        * Boot disk : Debian GNU/Linux 9(stretch) 30GB HDD
        * Identity and API access : 允許預設存取權
        * Firewall : 允許 HTTP 流量、允許 HTTPS 流量
        * IP : 34.105.17.84
        * Port : 3306(MySQL)、3000(API)、8080(跨域)
        
## MySQL 資料庫
    ∙ Host : 34.105.17.84
    ∙ Port: 3306
    ∙ 使用者 : root
    ∙ 密碼 : 406261688
    ∙ 資料庫名稱：專題資料庫

## 資料庫 Table 列表
    ∙ user_info (使用者資訊)
        * user_id (fireBase UID) <- Primary Key
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * user_password (使用者密碼)
            型別 : VARCHAR(100)
            空值 : NOT NULL
        * user_picture (使用者頭貼)
            型別 : LONGTEXT
            Default : NULL
        * user_email (使用者信箱)
            型別 : VARCHAR(100)
            空值 : NOT NULL
        * user_gender (使用者性別)
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * user_age (使用者生日)
            型別 : VARCHAR(10)
            Default : NULL
        * user_name (使用者暱稱)
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * user_hobby (使用者愛好)
            型別 : VARCHAR(100)
            Default : NULL
        * user_like_country (使用者喜歡國家)
            型別 : VARCHAR(100)
            Default : NULL
        * user_change (使用者交換才能)
            型別 : VARCHAR(100)
            Default : NULL
        * user_try (使用者想嘗試的事情)
            型別 : VARCHAR(100)
            Default : NULL
        * user_school (使用者學校)
            型別 : VARCHAR(100)
            Default : NULL
        * LastLogin (最後登入時間)
            型別 : datetime
            Default : NULL
    ∙ user_club (使用者社團)
        * user_id (user_info UID) <- Primary Key
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * club_id (club UID) <- Primary Key
            型別 : INT(11)
            空值 : NOT NULL
    ∙ club (社團)
        * club_id (club UID) <- Primary Key
            型別 : INT(11)
            空值 : NOT NULL
        * club_name (社團名稱)
            型別 : VARCHAR(100)
            空值 : NOT NULL
    ∙ friend (好友名單)
        * chat_id (chat UID) <- Primary Key
            型別 : INT(11)
            空值 : NOT NULL
        * user_id_self (使用者-1)
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * user_id_other (使用者-2)
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * relation (關係狀態)
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * meetTime (認識時間)
            型別 : DATE
    ∙ chat (好友名單)
        * id (流水號) <- Primary Key
            型別 : INT(11)
            空值 : NOT NULL
        * chat_id (chat UID)
            型別 : INT(11)
            空值 : NOT NULL
        * chat_user (使用者 ID)
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * chat_text (內容)
            型別 : TEXT
            空值 : NOT NULL
        * chat_name (使用者 名稱)
            型別 : VARCHAR(45)
            空值 : NOT NULL
    ∙ article (發文)
        * article_id (article UID) <- Primary Key
            型別 : INT(11)
            空值 : NOT NULL
        * article_text (發文內容)
            型別 : TEXT
            Default : NULL
        * article_picture (發文圖片)
            型別 : LONGTEXT
            Default : NULL
        * article_time (發文時間)
            型別 : VARCHAR(45)
            Default : NULL
        * user_id (fireBase UID)
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * post_level (文章權限)
            型別 : VARCHAR(2)
            空值 : NOT NULL
        * likes (讚數量)
            型別 : INT(11)
            空值 : NOT NULL
        * post_level (文章權限))
            型別 : VARCHAR(2)
            空值 : NOT NULL
        * club_id (club UID)
            型別 : INT(11)
            空值 : NOT NULL
    ∙ command (留言)
        * sequence <- Primary Key
            型別 : INT(11)
            空值 : NOT NULL
        * article_id (article UID) <- Primary Key
            型別 : INT(11)
            空值 : NOT NULL
        * user_id (fireBase UID)
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * user_command (留言內容)
            型別 : TEXT
        * command_time (留言時間)
            型別 : VARCHAR(10)
            空值 : NOT NULL
    ∙ likes (點讚)
        * like_id (like UID) <- Primary Key
            型別 : INT(11)
            空值 : NOT NULL
        * user_id (fireBase UID)
            型別 : VARCHAR(50)
            空值 : NOT NULL
        * article_id (article UID)
            型別 : INT(11)
            空值 : NOT NULL
## API 列表
* Host : 34.105.17.84
* Port : 3000
```
    * 測試連線
        API : /api/testConnect
        Method : GET
        Output : 若成功回傳則會輸出 success，可用來簡易測試是否連線

    * 註冊
        API : /api/signup
        Method : POST
        Input : 使用者名稱、信箱、密碼、生日、性別
        Output : 成功註冊、帳號已存在、無效帳號
```

## 伺服器檔案架構
* Path : /var/www/html/
```
├── test (測試)
|
└── Web_Community (專案)
```

## 專案架構
* Path : /var/www/html/Web_Community
```
├── README.md (說明檔)
|
├── api
|   ├── cors.js (跨域處理)
|   └── main.js (api檔)
|
├── web (網頁端)
|   ├── css
|   |
|   ├── fonts
|   |
|   ├── fragments (套件檔案)
|   |   ├── bootbox (警示框)
|   |   ├── bootstrap
|   |   ├── datatable (表格)
|   |   ├── fontawesome (小圖案)
|   |   └── jquery
|   |
|   ├── img
|   |
|   ├── js
|   |   ├── anonymous.js
|   |   ├── common.js
|   |   ├── createNew.js
|   |   ├── forgot.js
|   |   ├── friend.js
|   |   ├── group.js
|   |   ├── html5shiv.js
|   |   ├── index.js
|   |   ├── init.js
|   |   ├── login.js
|   |   ├── pickcrad.js
|   |   ├── profile.js
|   |   ├── signup.js
|   |   ├── skel-layers.min.js
|   |   └── skel.min.js
|   |   
|   ├── anonymous.html (匿名)
|   ├── createNew.html (重設密碼)
|   ├── forgot.html (忘記密碼)
|   ├── friend.html (朋友列表)
|   ├── group.html (社團)
|   ├── index.html (首頁)
|   ├── login.html (登入)
|   ├── pickcard.html (抽卡)
|   ├── profile.html (個人資料)
|   ├── signup.html (註冊)
└── └── createNew.html (申請新密碼)
```


