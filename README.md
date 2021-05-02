# Flexilis Server

## Introduction

## API Docs

### 광고 사이트 회원가입
광고 사이트의 register 페이지에서 입력된 form 데이터를 server에 POST 요청을 보내서 회원가입하는 API입니다.

#### Path
POST: /auth/register/advertiser

**Example Endpoint**
http://localhost:5000/auth/register/advertiser

#### Request Parameter

**Body Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| email | O | String | 이메일 |
| name | O | String | 이름 |
| password | O | String | 비밀번호 |
| passwordConfirm | O | String | 비밀번호 확인 |
| companyEmail | O | String | 회사 이메일 |
| companyName | O | String | 회사명 |
| companyRegistrationNumber | O | String | 사업자 등록번호 |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'register success' |

#### Error Spec
| Code | Message |
| ------ | ------ |
| 400 | 입력값에 오류가 있습니다 |

- - -

### 광고 사이트 로그인
광고 사이트의 login 페이지에서 입력된 form 데이터를 server에 POST 요청을 보내서 로그인하는 API입니다.

#### Path
POST: /auth/login/advertiser

**Example Endpoint**
http://localhost:5000/auth/login/advertiser

#### Request Parameter

**Body Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| email | O | String | 이메일 |
| password | O | String | 비밀번호 |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'login success' |
| data | Object | accessToken - JWT token, user - email, name, companyName, companyEmail |

#### Error Spec
| Code | Message |
| ------ | ------ |
| 400 | 입력값에 오류가 있습니다 |
| 401 | 입력값에 오류가 있습니다 |

- - -

### 광고 캠페인 생성
새롭게 생성된 캠페인 데이터를 db에 저장하는 API입니다.

#### Path
POST: /campaign

**Example Endpoint**
http://localhost:5000/campaign

#### Request Parameter

**Head Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| Authorization | O | String | JWT token |

**Body Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| title | O | String | 캠페인 제목 |
| campaignType | O | String | enum: ['banner', 'text', 'video'] |
| expiresType | O | String | enum: ['continue', 'expired'] |
| content | O | String | 현재는 banner URL에 해당함, 나중에 배너 광고 말고 다른 것을 선택하면 달라질 수도 있음 |
| expiresAt | X | Date | 만료일 |
| dailyBudget | O | Number | |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'create campaign success' |
| data | Object | merchantId - campaign을 저장한 MongoDB document의 _id |

#### Error Spec
| Code | Message |
| ------ | ------ |
| 400 | 필수 파라미터가 존재하지 않습니다 |
| 401 | 유효하지 않은 토큰입니다 |

- - -

### Get Videos
사용자가 앱을 켰을 때 모든 Video 데이터를 받아오도록 서버로 요청하는 API입니다.

#### Path
GET: /videos

**Example Endpoint**
http://localhost:5000/videos

#### Request Parameter

**Head Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| Authorization | O | String | JWT token |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'success' |
| data | Object | bodyPart의 videoList |

- - -

### 광고 캠페인 생성
새롭게 생성된 캠페인 데이터를 db에 저장하는 API입니다.

#### Path
POST: /campaign

**Example Endpoint**
http://localhost:5000/campaign

#### Request Parameter

**Head Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| Authorization | O | String | JWT token |

**Body Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| title | O | String | 캠페인 제목 |
| campaignType | O | String | enum: ['banner', 'text', 'video'] |
| expiresType | O | String | enum: ['continue', 'expired'] |
| content | O | String | 현재는 banner URL에 해당함, 나중에 배너 광고 말고 다른 것을 선택하면 달라질 수도 있음 |
| expiresAt | X | Date | 만료일 |
| dailyBudget | O | Number | |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'create campaign success' |
| data | Object | merchantId - campaign을 저장한 MongoDB document의 _id |

#### Error Spec
| Code | Message |
| ------ | ------ |
| 400 | 필수 파라미터가 존재하지 않습니다 |
| 401 | 유효하지 않은 토큰입니다 |

- - -

### Get Campaign Data of Advertiser
광고 사이트의 대시보드 페이지에서 광고주가 등록한 캠페인 데이터들을 가져오는 API입니다.

#### Path
GET: /campaign

**Example Endpoint**
http://localhost:5000/campaign

#### Request Parameter

**Head Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| Authorization | O | String | JWT token |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'success campaign' |
| data | Object | advertiser의 모든 campaign 데이터(res.data.campaigns) |

#### Error Spec
| Code | Message |
| ------ | ------ |
| 400 | advertiserId가 존재하지 않습니다 |
| 401 | 유효하지 않은 토큰입니다 |

- - -

### Get Campaign Popup
스트레칭 앱을 통해 화면에 스트레칭 영상이 팝업되기 3분 전에 notification이 뜰 때 팝업 안에서 같이 띄울 광고를 서버에 요청하는 API입니다.

#### Path
GET: /campaign/popup

**Example Endpoint**
http://localhost:5000/campaign/popup

#### Request Parameter

**Head Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| Authorization | O | String | JWT token |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'success to get campaign pop-up' |
| data | Object | campainId, content |

#### Error Spec
| Code | Message |
| ------ | ------ |
| 400 | 잘못된 요청입니다 |

- - -

### 캠페인 광고 도달수, 클릭수 저장
스트레칭을 보여주는 팝업에서 유저가 광고를 보거나 클릭했을때 요청이 들어오고, campaign id에 따라 reach, click의 카운트를 늘리는 API입니다.

#### Path
PATCH: /campaign/stats

**Example Endpoint**
http://localhost:5000/campaign/stats

#### Request Parameter

**Body Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| campaignId | O | String | mongoDB에서 campaign document의 _id |
| type | O | String | 캠페인 제목 |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'update campaign stats success' |

#### Error Spec
| Code | Message |
| ------ | ------ |
| 400 | 잘못된 요청입니다 |

- - -

### 스트레칭 앱 회원가입
스트레칭 앱에서 입력된 register form 데이터를 server에 POST 요청을 보내서 회원가입하는 API입니다.

#### Path
POST: /auth/register/user

**Example Endpoint**
http://localhost:5000/auth/register/user

#### Request Parameter

**Body Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| email | O | String | 이메일 |
| password | O | String | 비밀번호 |
| name | O | String | 이름 |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'register success' |

#### Error Spec
| Code | Message |
| ------ | ------ |
| 400 | 입력값에 오류가 있습니다 |

- - -

### 스트레칭 앱 로그인
스트레칭 앱에서 입력된 login form 데이터를 server에 POST 요청을 보내서 로그인하는 API입니다.

#### Path
POST: /auth/login/user

**Example Endpoint**
http://localhost:5000/auth/login/user

#### Request Parameter

**Head Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| Content-Type | O | String | application/json |

**Body Parameter**
| Name | Required | Type | Description |
| ------ | ------ | ------ | ------ |
| email | O | String | user의 email 주소 |
| password | O | String | user의 계정 비밀번호 |

#### Response Parameter

**Body Parameter**
| Name | Type | Description |
| ------ | ------ | ------ |
| code | Number | HTTP response code |
| message | String | 'login success' |
| data | Object | accessToken - JWT token |

#### Error Spec
| Code | Message |
| ------ | ------ |
| 400 | 입력값에 오류가 있습니다 |
