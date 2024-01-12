requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function water_sort_animation(tgt_node, data) {
            if (!data || !data.ext) {
                return
            }

            /**
             * 
             * attr
             * 
             */
            const attr = {
                water_color: {
                    a: { 'fill': '#82D1F5' },
                    b: { 'fill': '#006CA9' },
                    c: { 'fill': '#C5FFF5' },
                    d: { 'fill': '#294270' },
                    e: { 'fill': '#666666' },
                    g: { 'fill': '#EEEEEE' },
                    f: { 'fill': '#CCCCCC' },
                },
                test_tube: {
                    'stroke-width': 1,
                    'stroke': '#999999',
                },
                number: {
                    'font-family': 'times',
                    'font-size': '15px',
                },
                message: {
                    'font-family': 'times',
                    'font-size': '12px',
                },
            }

            /**
            * 
            * values
            * 
            */
            const tube_width = 11
            const tube_margin_w = 6
            const explanation = data.ext.explanation
            const water_layer = explanation[0].map(x => x.length).reduce((a, b) => Math.max(a, b))
            const tube_num = explanation[0].length
            const os_top = 10 
            const os_bottom = 35
            const os_v = os_top + os_bottom
            const os_side = 30
            const grid_size_px_v = 60
            const grid_size_px_h = (tube_width + tube_margin_w) * tube_num
            const water_unit = grid_size_px_v / water_layer
            const delay = 400
            const spaced_explanation = []
            explanation.forEach(tubes => {
                const spaced_tubes = []
                tubes.forEach(tube => {
                    let spaced_tube = ''
                    for (let i = 0; i < water_layer - tube.length; i += 1) {
                        spaced_tube += ' '
                    }
                    spaced_tube += tube
                    spaced_tubes.push(spaced_tube)
                })
                spaced_explanation.push(spaced_tubes)
            })

            /**
            * 
            * paper
            * 
            */
            const paper = Raphael(tgt_node, grid_size_px_h + os_side * 2, grid_size_px_v + os_v)

            /**
            * 
            * make sequence
            * 
            */
            const sequence = []
            for (let i = 0; i < spaced_explanation.length - 1; i += 1) {
                const prev_row = spaced_explanation[i]
                const next_row = spaced_explanation[i + 1]
                const src_change = []
                const dst_change = []
                for (let j = 0; j < prev_row.length; j += 1) {
                    for (let k = 0; k < prev_row[0].length; k += 1) {
                        if (prev_row[j][k] != next_row[j][k]) {
                            if (prev_row[j][k] == ' ') {
                                dst_change.unshift([[j, k], next_row[j][k]])
                            } else {
                                src_change.push([j, k])
                            }
                        }
                    }
                }
                for (let m = 0; m < src_change.length; m += 1) {
                    sequence.push([src_change[m]].concat(
                        [dst_change[m][0]],
                        [dst_change[m][1]],
                        [src_change.length],
                        [i + 1],
                    ))
                }
            }

            /**
            * 
            * init draw 
            * 
            */
            const tubes = []
            for (let i = 0; i < tube_num; i += 1) {
                // water
                tubes.push([])
                for (let j = 0; j < water_layer; j += 1) {
                    tubes[i].push(paper.rect(
                        i * (tube_width + tube_margin_w) + os_side + 1,
                        (j + 1) * water_unit + os_top,
                        tube_width, 0
                    ).attr({ 'stroke-width': 0 }))
                }
                // draw test_tube
                paper.path(
                    [
                        'M', i * (tube_width + tube_margin_w) - 1 + os_side, 0 + os_top,
                        'h', 2,
                        'v', grid_size_px_v - 5,
                        'a', tube_width / 2, tube_width / 2, 0, 1, 0, tube_width, 0,
                        'v', -(grid_size_px_v - 5),
                        'h', 2,
                    ]
                ).attr(attr.test_tube)
                // bottom_mask
                paper.path(
                    [
                        'M',
                        i * (tube_width + tube_margin_w) - .5 + os_side + 1,
                        grid_size_px_v - 5 + os_top,
                        'a', (tube_width + .5) / 2, (tube_width + .5) / 2, 0, 1, 0,
                        tube_width + 1,
                        0,
                        'v', tube_width,
                        'h', -(tube_width + 1),
                        'v', -tube_width,
                        'z'
                    ]
                ).attr({ 'fill': '#C9EBFB', 'stroke-width': 0 })
            }
            // number
            const num = paper.text(
                os_side + (tube_num + 1) * (tube_width + tube_margin_w),
                grid_size_px_v / 2 + os_top, 0).attr(attr.number)
            // frame
            paper.path(
                [
                    'M', os_side - 4, grid_size_px_v / 2 + os_top,
                    'v', grid_size_px_v / 2 + 4,
                    'h', tube_num * (tube_width + tube_margin_w) + 4,
                    'v ', -(grid_size_px_v / 2 + 4),
                ]).attr(attr.test_tube)
            // click anywhere to start
            paper.text((grid_size_px_h + os_side * 2) / 2, grid_size_px_v + os_top + 18,
                'Click anywhere to start').attr(attr.message)

            /**
            *
            * main
            *
            */
            waters_initialize()
            let sorting = false
            let complite = false
            tgt_node.onclick = (function () {
                if (complite) {
                    waters_initialize()
                    complite = false
                } else {
                    if (!sorting) {
                        sorting = true
                        move_main()
                    } else {
                        sorting = false
                    }
                }
            })

            /**
            *
            * set start waters
            *
            */
            function waters_initialize() {
                for (let i = 0; i < tube_num; i += 1) {
                    for (let j = 0; j < water_layer; j += 1) {
                        let water = spaced_explanation[0][i].slice(j, j + 1)
                        if (water != ' ') {
                            tubes[i][j].attr({ 'y': j * water_unit + os_top, 'height': water_unit })
                            tubes[i][j].attr(attr.water_color[water])
                        } else {
                            tubes[i][j].attr({ 'y': (j + 1) * water_unit + os_top, 'height': 0 })
                        }
                    }
                }
                num.attr('text', 0)
            }

            /**
            *
            * move waters 
            *
            */
            function move_main() {
                let i = 0;
                let n = 0;
                (function move_sub() {
                    num.attr('text', n)
                    if (i == sequence.length) {
                        sorting = false
                        complite = true
                        return
                    }
                    if (!sorting) {
                        waters_initialize()
                        return
                    }
                    const [a, b, color, len, step] = sequence[i]
                    const [x1, y1] = a
                    const [x2, y2] = b
                    tubes[x2][y2].animate({ 'y': (y2) * water_unit + os_top, 'height': water_unit, }, delay / len,)
                    tubes[x2][y2].animate(attr.water_color[color], 0)
                    tubes[x1][y1].animate({ 'y': (y1 + 1) * water_unit + os_top, 'height': 0, }, delay / len, move_sub)
                    i += 1
                    n = step
                })()
            }

        }
        var io = new extIO({
            animation: function ($expl, data) {
                water_sort_animation(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
