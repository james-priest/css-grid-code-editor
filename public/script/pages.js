var getPages = function() {
    return pages;
};
var pages = [
    // {
    //     num: 0,
    //     title: 'CSS Grid',
    //     subtitle: '',
    //     instructions: {
    //         part1: "",
    //         part2: ""
    //     },
    //     code: {
    //         preFill: '.grid {\n\t@\n}',
    //         solution: ''
    //     },
    //     gridContainer: {
    //         guide: '',
    //         guidelines: '',
    //         grid: ''
    //     },
    //     style: '',
    // },
    {
        num: 13,
        title: 'CSS Grid',
        subtitle: 'Challenge 1.2',
        instructions: {
            part1: "<p>Steps to solve the challenge:</p>\n<ol>\n\t<li>Power up the Grid using <code>display: grid;</code></li>\n\t<li>Define the correct number of tracks using <code>fr</code> units to begin.</li>\n\t<li>Adjust the sizes of the tracks until everything lines up.</li>\n</ol>",
            part2: ""
        },
        code: {
            preFill: '.grid {\n\t@\n}',
            solution: '\tdisplay: grid;\n\tgrid-template-columns: repeat(4, 1fr);\n\tgrid-template-rows: 1fr 2fr 1fr;'
        },
        gridContainer: {
            guide: '<div class="dunes"></div>\n<div class="rocky"></div>\n<div class="rocky"></div>\n<div class="dunes"></div>',
            guidelines: '<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>',
            grid: '<div class="target dunes"></div>\n<div class="target rocky"></div>\n<div class="target rocky"></div>\n<div class="target dunes"></div>'
        },
        style: '.guide, .guidelines {\n\tgrid-template-columns: repeat(4, 1fr);\n\tgrid-template-rows: 1fr 2fr 1fr;\n}',
    },
    {
        num: 14,
        title: 'CSS Grid',
        subtitle: 'Challenge 1.3',
        instructions: {
            part1: "<p>The top and bottom rows are each using <code>20vh</code> units.</p>\n<p>Those are just like percents(<code>%</code>) but are relative to the <em>viewport's height</em> rather than to the Grid element's height.</p>",
            part2: "<p>In this case, the <code>vh</code> units will match the sizes and the <code>fr</code> units will take up the rest of the space.</p>"
        },
        code: {
            preFill: '.grid {\n\t@\n}',
            solution: '\tdisplay: grid;\n\tgrid-template-columns: 1fr 1fr;\n\tgrid-template-rows: 20vh 1fr 20vh;'
        },
        gridContainer: {
            guide: '<div class="dunes"></div>\n<div class="dunes"></div>\n<div class="rocky"></div>\n<div class="rocky"></div>\n<div class="cloudy"></div>\n<div class="cloudy"></div>',
            guidelines: '<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>\n<div></div>',
            grid: '<div class="target dunes"></div>\n<div class="target dunes"></div>\n<div class="target rocky"></div>\n<div class="target rocky"></div>\n<div class="target cloudy"></div>\n<div class="target cloudy"></div>'
        },
        style: '.guide, .guidelines {\n\tgrid-template-columns: 1fr 1fr;\n\tgrid-template-rows: 20vh 1fr 20vh;\n}'
    },
];