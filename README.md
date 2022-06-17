# MATRIP

MATRIP은 여행 일정 관리 사이트로, 여행 지역을 설정하고 그 지역의 주요 관광지, 맛집 등의 장소 리스트와 해당 장소의 간단한 정보를 보여주고 장소를 자신의 여행 일정에 추가하여 여행 전에는 계획할 수 있고, 자신이 계획한 일정을 실행하고, 여행 후 자신이 했던 여행 일정을 기록할 수 있는 서비스이다.

## 작품 내용
----------
### 데이터베이스 구조
![image](https://user-images.githubusercontent.com/88087225/174256600-9eea57c6-d48f-4fdb-99cd-7b96d391c6e3.png)

- users 테이블은 사용자 정보를 저장
- trips 테이블은 사용자가 만든 특정 여행지의 일정
- tripDetails 테이블은 여행지의 일정의 상세 정보인 어느 날짜(date 속성)에 어느 관광지들을 가고, 관광지들의 순서 배치 정보(number 속성)를 저장
- locations 테이블은 여행지들의 정보를 저장
- spots 테이블은 여행지의 관광지들을 저장하는 테이블로 lat은 위도, lng은 경도로 해당 관광지의 위치 속성이고, type은 관광 명소인지 맛집인지를 구분하는 속성
   
### 프로젝트 구조
![image](https://user-images.githubusercontent.com/88087225/174258154-ba10e347-3d98-49f4-958e-d3d39f79f0c0.png)
   
### 각 화면 및 기능들의 요청 경로
![image](https://user-images.githubusercontent.com/88087225/174258315-dc7eefdf-4631-4772-bf63-92c5a07752ba.png)
   
### 작품 기능
#### 로그인, 회원가입 기능
![image](https://user-images.githubusercontent.com/88087225/174259835-b9d576a7-31d9-47f9-9e95-903feb54a37c.png)

> 서버 실행 후 locahost:8008로 접속 시 GET / 요청의 라우터에 isLoggedIn 미들웨어를 부착하여  로그인 되어 있지 않으면 로그인 화면으로 넘어가게 된다. 해당 서비스는 로그인하지 않으면 이용할 수 없다. 이외에도 isLoggedIn 미들웨어가 부착되어 있는 라우터에서는 요청을 받을 때 로그인 되어있지 않으면 로그인 화면으로 넘어간다.
- <routes/page.js>
```javascript
router.get('/', isLoggedIn, async (req, res, next) => {}
```
- <routes/middlewares.js>
```javascript
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};
```
![image](https://user-images.githubusercontent.com/88087225/174261835-4349d19f-9a23-4904-a807-3e9290c71dde.png)
> 회원가입은 비밀번호를 암호화하여 데이터베이스에 저장한다. 로그인은 passport의 로컬 로그인을 이용하여 로그인한다. 로그인 시 세션에 유저의 id를 저장한다. 어떤 요청이 들어오면 항상 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 passport.deserializeUser 메소드를 호출하고 req.session에 저장된 아이디로 데이터베이스에서 사용자를 조회하고 사용자 정보를 req.user에 저장한다.
   
#### 메인 페이지
![image](https://user-images.githubusercontent.com/88087225/174262290-16bf5818-a806-4f9a-9f83-ecbe9d3bfcb0.png)
> 로그인에 성공하면 비로소 메인 화면에 진입하게 된다. 메인 화면의 좌측 하단은 이미지들이 2초에 한 번씩 바뀌게 된다. 우측 하단에는 로그인한 유저의 여행 목록들을 데이터베이스에서 가져와 화면 렌더링 시 넌적스 반복문을 이용해 목록으로 표시된다.   
   
#### 여행지 목록, 여행지 검색
![image](https://user-images.githubusercontent.com/88087225/174262998-637ce2c0-9f32-4987-b248-4136b0de07d8.png)
> 메인 화면에서 새로운 여행 준비하기 버튼 혹은 여행지 둘러보기 버튼을 클릭하면 여행지 목록 화면이 표시된다. 데이터베이스에서 여행지 목록들을 가져와 화면 렌더링 시 넌적스 반복문을 이용해 표시된다. 여행지 목록 화면에서는 검색어를 입력하여 submit 하게 되면 GET /location?search=”검색어”로 요청을 보내게 된다. 라우터에서는 검색어를 이용하여 그에 맞는 데이터들만을 가지고 다시 화면을 렌더링한다.   
   
#### 여행지 상세 정보, 내 여행 목록, 다른 사람의 여행 목록, 관광지 목록
![image](https://user-images.githubusercontent.com/88087225/174263631-0543ec68-8ef0-4f9f-a83a-974757206e6d.png)
> 여행지 목록에서 여행지 하나를 클릭 시, 해당 여행지의 상세 정보를 데이터베이스에서 가져와 넌적스를 이용해 화면에 표시된다. 하단에 있는 버튼들을 클릭하면 이름에 맞는 목록을 표시하게 위해 스크립트에서 ajax 요청을 전송해 데이터베이스에서 해당 데이터를 가져와 HTML을 만들어 표시한다.

![image](https://user-images.githubusercontent.com/88087225/174263900-8df5d13a-0b53-4e60-8113-34f7f4abed11.png)
- <locationDetail.html>
```javascript
// 다른 사람의 여행 버튼 클릭, 해당 여행지의 다른 사람의 여행 목록을 만들어 채움
othersTripBtn.addEventListener('click', (event) => {
    const othersHtmlList = [];

    axios.get(`/trips/{{ location.id }}`)
        .then((res) => {
            const trips = res.data;
            trips.forEach(trip => {
                othersHtmlList.push(`
                    <a href="/tripDetail/${trip.id}" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                        <div class="d-flex gap-2 w-100 justify-content-between">
                            <div class="align-self-center">
                                <h4 class="mb-0">${trip.User.username}님의 {{ location.name }} 여행</h4>
                                <p class="mb-0 opacity-75">${trip.start} ~ ${trip.end}</p>
                            </div>
                        </div>
                    </a>`
                );
            });
            tripsContainer.innerHTML = othersHtmlList.join('');
        })
        .catch(err => console.error(err));
});
```
관광지 목록에서 관광지 하나를 클릭하면 해당 관광지의 상세정보를 볼 수 있다. 지도는 구글맵 API를 이용하였다.
![image](https://user-images.githubusercontent.com/88087225/174265033-a67ce50c-dbcd-42a9-8531-e3b5c300d076.png)   
   
#### 여행 상세 일정
> 내 여행 목록이나 다른 사람의 여행 목록에서 하나를 클릭하면 해당 여행의 상세 일정 화면을 보여준다. 여행 상세 일정 화면을 표시할 때 넌적스 조건문을 이용해 로그인한 유저의 여행이면 편집 버튼과 장소 추가 버튼을 표시하여 수정이 가능하게 하고, 다른 유저의 여행이면 표시하지 않는다.

![image](https://user-images.githubusercontent.com/88087225/174265197-5833d384-76b6-4cbb-ac8a-d2d459dd1904.png)
![image](https://user-images.githubusercontent.com/88087225/174265236-63f49faf-52b4-47aa-bc42-9ab9ebbf7c32.png)

>  여행 상세 일정 화면의 표시는 GET /tripDetail/:tripId 요청을 라우터가 받으면 tripId를 이용해 여행지 이름, 각 일정의 상세 정보(관광지 이름, 위치, 날짜, 일정 번호, 관광 or 맛집 타입)들을 가져오고, 날짜마다 화면에 표시해야 하기 때문에 여행 시작일과 종료일을 이용해 날짜들을 따로 모아놓은 배열을 만들어 전달한다. 이 데이터들을 가지고 넌적스를 적절히 이용해 여행 상세 일정 화면을 표시한다. 관광지를 클릭하면 관광지 상세 정보 페이지로 이동한다.   
 지도 보기 버튼을 클릭하면 각 날짜에 있는 관광지들의 위치가 지도에 마커로 번호에 맞춰 표시되고 번호 순으로 선으로 연결된다. 각 위치들의 중심 좌표를 구해 지도가 로드될 때의 중심을 설정한다. 구글맵 API를 이용하였다.
- <routes/pages.js>
![image](https://user-images.githubusercontent.com/88087225/174266648-017ec22b-b281-48cb-bf62-332e6ae06cfc.png)
- <tripDetail.html>
![image](https://user-images.githubusercontent.com/88087225/174266770-3a6961db-6299-42c5-8ca2-b4cf0a88495b.png)   
   
#### 여행 일정에 장소 추가
> 여행 상세 일정 화면에서 장소 추가 버튼을 클릭하면 장소 선택 화면이 표시된다.

![image](https://user-images.githubusercontent.com/88087225/174267342-968e36d3-a52c-4596-ab03-76ea667ecd9d.png)

> 관광지를 검색할 수 있으며, 선택을 누르면 중간의 공간에 선택한 장소들이 따로 표시된다. 관광지를 클릭하면 관광지 상세 정보 페이지로 이동한다.

![image](https://user-images.githubusercontent.com/88087225/174267375-534ac085-8322-4cab-ae2b-435866c1b211.png)

> 한 번에 여러 개의 관광지를 선택하여 추가할 수 있으며, 선택한 관광지는 해제도 가능하다. 선택 후 선택 완료 버튼을 클릭하면 다시 여행 상세 일정 화면으로 넘어가고, 둘째 날에 정상적으로 일정에 추가되어 있는 것을 볼 수 있다.

![image](https://user-images.githubusercontent.com/88087225/174267418-67d22956-acb1-41c6-b114-1dcf4f68db15.png)

- <selectSpot.html>
![image](https://user-images.githubusercontent.com/88087225/174267532-cd947cda-6a7e-4a3f-bf66-5bf8d6289799.png)

#### 여행 상세 일정에서 장소 삭제
> 여행 상세 일정 화면에서 편집 버튼을 클릭하면 일정에서 관광지를 삭제할 수 있도록 X 버튼이 표시되고 편집 버튼은 완료 버튼으로 바뀐다.

![image](https://user-images.githubusercontent.com/88087225/174267900-1d47469f-bef8-40ae-b5e9-58113b4a5467.png)

> X 버튼을 클릭하면 .DELETE 요청을 보내 데이터베이스에서 해당 일정을 삭제하고 화면을 다시 로드한다. 완료 버튼을 클릭하면 화면이 다시 로드된다. 둘째 날의 마담 란을 삭제해보겠다.

![image](https://user-images.githubusercontent.com/88087225/174267963-ef8ccff0-164b-4a41-9f60-34fde81e5067.png)

> 정상적으로 삭제된 것을 볼 수 있다.

#### 새로운 여행 일정 만들기
![image](https://user-images.githubusercontent.com/88087225/174268336-247b385b-e546-4d51-afbb-2bf404491d60.png)

>  여행지 상세 정보 화면에서 시작일과 종료일을 지정하고 일정 만들기 버튼을 클릭하면 새로운 여행이 생성되고 여행 상세 일정 화면으로 이동한다.

![image](https://user-images.githubusercontent.com/88087225/174268409-ace01982-b25f-4582-936a-139f6b4ca8be.png)

> 장소를 추가하여 일정을 만들 수 있다. 지도에는 일정에 관광지가 없기 때문에 기본으로 설정해둔 서울이 표시된다.

![image](https://user-images.githubusercontent.com/88087225/174268463-1432e30e-e882-4cbb-874b-567b4a29aff7.png)

> 메인 화면에도 방금 생성한 여행이 추가되어 있는 것을 볼 수 있다.

#### 로그아웃
> Log out 버튼을 클릭하면 req.user 객체를 제거하고 req.session 객체의 내용을 제거하고 로그인 화면으로 돌아간다.


### 프로젝트 수행 중 문제점 및 해결 방안
>  처음 가장 나에게 문제였던 부분은 넌적스를 통해 렌더링 할 때 받아오는 변수를 스크립트에서도 사용할 수 있는 지였다. 찾아보니 스크립트에서도 따옴표나 백틱을 이용해 감싸 ‘{{ variable }}’ 과 같은 형태로 사용하면 값을 받아올 수 있었다. 하지만 이 방식으로는 단일 값을 문자열의 형태로 밖에 받을 수 없어 배열이나 객체는 받는 게 불가능했다. 그래서 배열이나 객체 데이터를 스크립트에서 받기 위해 객체의 키 값을 이용하여 단일 값만 넌적스로 받은 후axios.get(‘trip/{{ trip.id }}’) 와 같이 axios를 사용하여 데이터를 가져왔다.

> 내 여행 상세 일정 페이지에서 새로운 장소를 추가하는 기능이 가장 어려웠던 것 같은데, 일단 장소 추가를 클릭하면 같은 화면이 표시가 되는데, 이는 날짜별로 어떤 날짜의 장소 추가 화면인가 구분할 필요가 있었다. 구분을 위해 url에 date를 추가하여 페이지를 요청하였고 렌더링 시에도 넌적스 변수로 date를 전달하였다. 장소를 추가하는 POST 요청을 전송할 때에도 이를 이용해 날짜를 전달하여 해당 날짜에만 장소가 추가될 수 있게 하였다. 

> 또한 장소를 추가할 때 여러 장소를 한 번에 추가할 수 있도록 기능을 만들었기 때문에 일정의 순서도 고려해야 했다. 배열을 하나 생성해 html 요소를 찾아 html에서 값을 추출하여 필요한 정보들이 담긴 객체를 만들어 배열에 하나씩 저장하고, 배열의 원소들을 axios.post를 이용하여 요청을 전송하였다. html에서 값을 추출할 때는 dataset 기능을 적극 이용하여 수월하게 데이터를 가져올 수 있도록 하였다. 
