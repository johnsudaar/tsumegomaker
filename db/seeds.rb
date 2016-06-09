# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Problem.create(player_color: 1,
               ia_color: 2,
               width: 9, height: 9,
               yaml_initial_board: "--- !ruby/object:Board\nboard_of_stone:\n- - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n- - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n- - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n- - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n- - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n- - 1\n  - 1\n  - 1\n  - 1\n  - 0\n  - 0\n  - 0\n  - 0\n  - 0\n- - 2\n  - 2\n  - 2\n  - 1\n  - 1\n  - 0\n  - 0\n  - 0\n  - 0\n- - 0\n  - 0\n  - 2\n  - 2\n  - 1\n  - 0\n  - 0\n  - 0\n  - 0\n- - 0\n  - 0\n  - 0\n  - 2\n  - 1\n  - 0\n  - 0\n  - 0\n  - 0\nheight: 9\nwidth: 9\nd4adj:\n- - 1\n  - 0\n- - -1\n  - 0\n- - 0\n  - 1\n- - 0\n  - -1\nko_move: []\nnb_captured:\n- 0\n- 0\nnot_border:\n- true\n- false\n- true\n- false\nmove_history: []\nboard_history: []\n",
               problem_file: "app/assets/problems/example1.sgf")
# Problem.create(player_color: 1,
#                ia_color: 2,
#                initial_board: "02220\n22222\n22222\n11112\n00012\n",
#                width: 5, height: 5,
#                problem_file: "app/assets/problems/example2.sgf")
# Problem.create(player_color: 1,
#                ia_color: 2,
#                initial_board: "001220\n000120\n011120\n022220\n020000\n000000",
#                width: 6, height: 6,
#                problem_file: "app/assets/problems/example3.sgf")
# Problem.create(player_color: 1,
#                ia_color: 2,
#                initial_board: "0200010\n2202210\n0102110\n0111000\n0000000\n0000000\n0000000\n",
#                width: 7, height: 7,
#                problem_file: "app/assets/problems/example4.sgf")