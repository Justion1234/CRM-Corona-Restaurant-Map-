var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new daum.maps.LatLng(37.5547612436712, 126.97048332343608), // 지도의 중심좌표 (서울역)
        level: 3 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new daum.maps.Map(mapContainer, mapOption); 

let infowindow = new kakao.maps.InfoWindow({
    zIndex: 1,
})

let markerList = [];


let ps = new daum.maps.services.Places();

searchPlaces();

function searchPlaces(){
    let keyword = $("#keyword").val();
    ps.keywordSearch(keyword, placesSearchCB);
}

function placesSearchCB(data, status, pagination) {
    if (status === daum.maps.services.Status.OK) {
        displayPlaces(data);
        displayPagination(pagination);
    } else if (status === daum.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다")
        return;
    } else if (status === daum.maps.services.Status.ERROR) {
        alert("검색 중 오류가 발생 했습니다")
        return;
    }

}

function displayPlaces(data) {
    let listEl = document.getElementById("placesList");
    let bounds = new daum.maps.LatLngBounds();

    removeAllChildNodes(listEl);
    removeMarker();

    for (let i = 0; i < data.length; i++) {

        let lat = data[i].y;
        let lng = data[i].x;
        let address = data[i]["address_name"];
        let title = data[i]["place_name"];

        const placePosition = new daum.maps.LatLng(lat, lng);
        bounds.extend(placePosition);

        let marker = new daum.maps.Marker({
            position: placePosition,
        });
        

        marker.setMap(map);
        markerList.push(marker);

        const el = document.createElement("div");
        const itemStr = `
            <div class="info">
                <div class="info_title">
                    ${title}
                </div>
                <span>${address}</span>
            </div>
        `;

        el.innerHTML = itemStr;
        el.className = "item";

        daum.maps.event.addListener(marker, "click", function () {
            displayInfowindow(marker, title, address, lat, lng);
        });

        daum.maps.event.addListener(map, "click", function(){
            infowindow.close();
        });

        el.onclick = function () {
            displayInfowindow(marker, title, address, lat, lng);
        };

        listEl.appendChild(el);  
    }
    map.setBounds(bounds);
}

function removeAllChildNodes(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}

function removeMarker() {
    for (let i=0; i < markerList.length; i++){
        markerList[i].setMap(null);
    }
    markerList=[];
}

function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i; 

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild);
    }

    for (i=1; i<=pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i===pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

function displayInfowindow(marker, title, address, lat, lng){
    let content = `
    <div style="padding:25px;">
        ${title}<br>
        ${address}<br>
        <button onClick="onSubmit('${title}','${address}',${lat},${lng});">등록</button>
    </div>
    `;
    map.panTo(marker.getPosition());
    infowindow.setContent(content);
    infowindow.open(map, marker);
} 

function onSubmit (title, address, lat, lng) {
    $.ajax({
        url : "/location",
        data: {title, address, lat, lng},
        type: "POST",
    })
    .done((respons) => {
        console.log("등록 완료");
        alert("등록이 완료 되었습니다");
    })
    .fail((error) => {
        console.log("등록 실패");
        alert("등록 중 문제가 발생했습니다.");
    });
    }

