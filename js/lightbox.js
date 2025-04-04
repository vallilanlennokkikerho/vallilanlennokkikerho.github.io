// Convert to arrow functions and use const
const isYoutubeLink = url => {
    const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(pattern) ? RegExp.$1 : false;
};

const isImageLink = url => {
    const pattern = /([a-z\-_0-9\/:.]*\.(jpg|jpeg|png|gif))/i;
    return !!url.match(pattern);
};
const isVimeoLink = async (url, el) => {
    try {
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=${url}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        el.classList.add('lightbox-vimeo');
        el.dataset.id = data.video_id;
        
        el.addEventListener("click", event => {
            event.preventDefault();
            document.getElementById('lightbox').innerHTML = `
                <a id="close"></a>
                <a id="next">&rsaquo;</a>
                <a id="prev">&lsaquo;</a>
                <div class="videoWrapperContainer">
                    <div class="videoWrapper">
                        <iframe src="https://player.vimeo.com/video/${el.dataset.id}/?autoplay=1&byline=0&title=0&portrait=0" 
                                allowfullscreen></iframe>
                    </div>
                </div>`;
            document.getElementById('lightbox').style.display = 'block';
            setGallery(el);
        });
    } catch (error) {
        console.error('Vimeo API error:', error);
    }
};
const setGallery = el => {
    document.querySelectorAll('.gallery').forEach(g => g.classList.remove('gallery'));
    
    if (el.closest('ul, p')) {
        const links = [...el.closest('ul, p').querySelectorAll("a[class*='lightbox-']")];
        links.forEach(link => link.classList.remove('current'));
        
        const currentLink = links.find(link => link.href === el.href);
        if (currentLink) currentLink.classList.add('current');
        
        if (links.length > 1) {
            document.getElementById('lightbox').classList.add('gallery');
            links.forEach(link => link.classList.add('gallery'));
            
            const currentIndex = links.findIndex(link => link.classList.contains('current'));
            const nextIndex = currentIndex === links.length - 1 ? 0 : currentIndex + 1;
            const prevIndex = currentIndex === 0 ? links.length - 1 : currentIndex - 1;
            
            document.getElementById('next').addEventListener("click", () => links[nextIndex].click());
            document.getElementById('prev').addEventListener("click", () => links[prevIndex].click());
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Create lightbox element
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    document.body.appendChild(lightbox);

    // Process links
    document.querySelectorAll('a:not(.no-lightbox)').forEach(async el => {
        const url = el.href;
        if (!url) return;
        
        if (url.includes('vimeo')) await isVimeoLink(url, el);
        else if (isYoutubeLink(url)) {
            el.classList.add('lightbox-youtube');
            el.dataset.id = isYoutubeLink(url);
        } 
        else if (isImageLink(url)) {
            el.classList.add('lightbox-image');
            const [name] = url.split('/').pop().split(".");
            el.title = name;
        }
    });

    // Lightbox close handler
    lightbox.addEventListener("click", event => {
        if (!['next', 'prev'].includes(event.target.id)) {
            lightbox.innerHTML = '';
            lightbox.style.display = 'none';
        }
    });
    
    //add the youtube lightbox on click
    var elements = document.querySelectorAll('a.lightbox-youtube');
    elements.forEach(element => {
        element.addEventListener("click", function(event) {
            event.preventDefault();
            document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://www.youtube.com/embed/'+this.getAttribute('data-id')+'?autoplay=1&showinfo=0&rel=0"></iframe></div>';
            document.getElementById('lightbox').style.display = 'block';

            setGallery(this);
        });
    });

    //add the image lightbox on click
    var elements = document.querySelectorAll('a.lightbox-image');
    elements.forEach(element => {
        element.addEventListener("click", function(event) {
            event.preventDefault();
            document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="img" style="background: url(\''+this.getAttribute('href')+'\') center center / contain no-repeat;" title="'+this.getAttribute('title')+'" ><img src="'+this.getAttribute('href')+'" alt="'+this.getAttribute('title')+'" /></div><span>'+this.getAttribute('title')+'</span>';
            document.getElementById('lightbox').style.display = 'block';

            setGallery(this);
        });
    });
});