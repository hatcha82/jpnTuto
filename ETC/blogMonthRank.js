var html = `
<table>
	<tr>
		<td width="30" align="center">순위</td><td">제목</td>
	</tr>
	[trs]
</table>
`
var rowTags = $("#_root > div > div > div:nth-child(2) > div.u_ni_stats_detail_wrap > div > div.u_ni_table_section > div > div:nth-child(1) > div > div > table > tbody > tr")
var trs = ''
var count = 1
$.map(rowTags,function(obj){
	if(count <= 10){
        var aTag = $(obj).find('td.u_ni_align_l a').attr('href')
        var rank = $(obj).find('td:first-child').text()
        var blogId =aTag.replace('/blog/article/','').replace('/cv','') 
        var link = 'https://blog.naver.com/hatcha82/' + blogId
        var title = $(obj).find('td.u_ni_align_l a').text()		
        title = title.replace('J-pop : ','').replace('[','')

		var artist = title.split('] ')[0].replace('] ','')
		var songTitle = title.split('] ')[1]
		
        var trTag = `<tr><td align="center">${rank}</td><td><a href="${link}" title="${songTitle} - ${artist}">${songTitle}</a></td><tr>`
        trs+=trTag
		count++
    }
})
html.replace('[trs]',trs)