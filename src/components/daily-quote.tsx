'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Quote } from 'lucide-react'

const motivationalQuotes = [
  // オリジナルの学習メッセージ
  {
    text: "学習は一生の旅です。毎日の小さな一歩が、大きな成果につながります。",
    author: "StudyFlow"
  },
  {
    text: "成功への道は、継続という石で舗装されています。",
    author: "継続は力なり"
  },
  {
    text: "今日の努力は、明日の自分への最高のプレゼントです。",
    author: "未来の自分へ"
  },
  {
    text: "知識は唯一、分け合うほど増える宝物です。",
    author: "学びの本質"
  },
  {
    text: "間違いを恐れるな。間違いから学ぶことが最も価値ある学習だ。",
    author: "失敗から学ぶ"
  },
  {
    text: "目標は夢に期限をつけたもの。今日も一歩前進しましょう。",
    author: "目標達成"
  },
  {
    text: "勉強は自分自身への投資。この投資に失敗はありません。",
    author: "自己投資"
  },
  {
    text: "集中力は筋肉のようなもの。使えば使うほど強くなります。",
    author: "集中の力"
  },
  {
    text: "今日できることを明日に延ばすな。明日の自分は今日より忙しい。",
    author: "時間の価値"
  },
  {
    text: "完璧を目指すよりも、継続することを選びましょう。",
    author: "継続の重要性"
  },
  {
    text: "勉強に遅すぎることはない。今日が人生で一番若い日です。",
    author: "学習のタイミング"
  },
  {
    text: "小さな進歩も進歩です。自分を褒めることを忘れずに。",
    author: "自己肯定"
  },
  {
    text: "困難な道こそが、あなたを成長させる最高の道です。",
    author: "成長の道"
  },
  {
    text: "質問することは無知の証拠ではなく、学ぼうとする意志の表れです。",
    author: "質問の価値"
  },
  {
    text: "今日の復習は、明日の新たな学習への準備です。",
    author: "復習の意味"
  },

  // 偉人の名言100選
  {
    text: "想像力は知識よりも大切だ。知識には限界があるが、想像力は世界を包み込む。",
    author: "アルベルト・アインシュタイン"
  },
  {
    text: "学べば学ぶほど、自分が何も知らなかったことに気づく。気づけば気づくほど、また学びたくなる。",
    author: "アルベルト・アインシュタイン"
  },
  {
    text: "千里の道も一歩から。",
    author: "老子"
  },
  {
    text: "知識への投資は最高の利息を生む。",
    author: "ベンジャミン・フランクリン"
  },
  {
    text: "教育は最も強力な武器であり、それによって世界を変えることができる。",
    author: "ネルソン・マンデラ"
  },
  {
    text: "学習に王道なし。",
    author: "ユークリッド"
  },
  {
    text: "読書は精神にとって運動が身体にとってもたらすものと同じである。",
    author: "リチャード・スティール"
  },
  {
    text: "人生は自転車に乗ることに似ている。バランスを保つためには動き続けなければならない。",
    author: "アルベルト・アインシュタイン"
  },
  {
    text: "今日という日は、残りの人生の最初の日である。",
    author: "チャールズ・ディードリッヒ"
  },
  {
    text: "学習は決して心を疲れさせない。",
    author: "レオナルド・ダ・ヴィンチ"
  },
  {
    text: "知識のない教育は盲目であり、教育のない知識は不毛である。",
    author: "イマヌエル・カント"
  },
  {
    text: "成功とは、失敗から失敗へと情熱を失うことなく進むことである。",
    author: "ウィンストン・チャーチル"
  },
  {
    text: "天才とは1％のひらめきと99％の努力である。",
    author: "トーマス・エジソン"
  },
  {
    text: "未来を予測する最良の方法は、それを創ることだ。",
    author: "ピーター・ドラッカー"
  },
  {
    text: "困難の中に、機会がある。",
    author: "アルベルト・アインシュタイン"
  },
  {
    text: "人は負けたら終わりなのではない。やめたら終わりなのだ。",
    author: "リチャード・ニクソン"
  },
  {
    text: "私は失敗したことがない。ただ、うまくいかない1万通りの方法を見つけただけだ。",
    author: "トーマス・エジソン"
  },
  {
    text: "最大の名誉は決して失敗しないことではなく、失敗するたびに立ち上がることにある。",
    author: "孔子"
  },
  {
    text: "時間を浪費するな、人生はそれでできているのだから。",
    author: "ベンジャミン・フランクリン"
  },
  {
    text: "教えることは二度学ぶことだ。",
    author: "ジョゼフ・ジューベル"
  },
  {
    text: "学問とは、苦労して身につけた知恵を、簡単に説明できることだ。",
    author: "アルベルト・アインシュタイン"
  },
  {
    text: "知識は力なり。",
    author: "フランシス・ベーコン"
  },
  {
    text: "人生における大きな秘訣は、決してあきらめないことだ。",
    author: "ウィンストン・チャーチル"
  },
  {
    text: "できると思えばできる、できないと思えばできない。これは、ゆるぎない絶対的な法則である。",
    author: "パブロ・ピカソ"
  },
  {
    text: "努力する人は希望を語り、怠ける人は不満を語る。",
    author: "井上靖"
  },
  {
    text: "勇気とは、恐怖に抵抗し、恐怖を克服することであり、恐怖を感じないことではない。",
    author: "マーク・トウェイン"
  },
  {
    text: "私は決して失望などしない。なぜなら、どんな失敗も新たな一歩となるからだ。",
    author: "トーマス・エジソン"
  },
  {
    text: "人間が犯す最大の誤りは、何かを恐れて何もしないことだ。",
    author: "エルバート・ハバード"
  },
  {
    text: "成功への道は失敗の道でもある。",
    author: "ジャン・コクトー"
  },
  {
    text: "問題は結果を出すことではない。どんな人間になるかだ。",
    author: "ジョン・ウッデン"
  },
  {
    text: "人は何かひとつのことを深く知ることによって、人生の全体を知ることができる。",
    author: "宮本武蔵"
  },
  {
    text: "学ぶことをやめた者は老人である。20歳であろうが80歳であろうが。",
    author: "ヘンリー・フォード"
  },
  {
    text: "良い質問をするためには、まず知識が必要だ。",
    author: "ヨハン・ゴットフリート・ヘルダー"
  },
  {
    text: "私は何も学ぶべきものを持たない人に出会ったことがない。",
    author: "ガリレオ・ガリレイ"
  },
  {
    text: "賢者は愚者から学ぶが、愚者は賢者からも学ばない。",
    author: "カトー"
  },
  {
    text: "昨日は歴史、明日は謎、そして今日は贈り物。だから今日をpresentと呼ぶ。",
    author: "エレノア・ルーズベルト"
  },
  {
    text: "本を読むことは、他人が辛苦してなしとげたことを、容易に自分のものにする最良の方法である。",
    author: "ソクラテス"
  },
  {
    text: "知恵の始まりは、用語の定義にある。",
    author: "ソクラテス"
  },
  {
    text: "私が知っている唯一のことは、私が何も知らないということである。",
    author: "ソクラテス"
  },
  {
    text: "人間は学習する動物である。",
    author: "アリストテレス"
  },
  {
    text: "学習とは、魂に何かを加えることではなく、魂の中にあるものを呼び覚ますことである。",
    author: "プラトン"
  },
  {
    text: "師は扉を開いて見せるが、中に入るのは弟子でなければならない。",
    author: "中国の格言"
  },
  {
    text: "完璧とは、付け加えるものが何もなくなった時ではなく、取り除くものが何もなくなった時に達成される。",
    author: "アントワーヌ・ド・サン=テグジュペリ"
  },
  {
    text: "やればできる、やらなければできない、やらずにできるわけがない。",
    author: "稲盛和夫"
  },
  {
    text: "何事も達成するのに遅すぎることはない。",
    author: "ジョージ・エリオット"
  },
  {
    text: "立ち止まっているときが、本当に進歩しているときかもしれない。",
    author: "荘子"
  },
  {
    text: "一日生きることは、一歩進むことでありたい。",
    author: "湯川秀樹"
  },
  {
    text: "過去と他人は変えられないが、未来と自分は変えられる。",
    author: "エリック・バーン"
  },
  {
    text: "成功は失敗の積み重ねの上に築かれる。",
    author: "IBM創設者トーマス・J・ワトソン"
  },
  {
    text: "最も重要なのは質問をやめないことだ。",
    author: "アルベルト・アインシュタイン"
  },
  {
    text: "学習において最も重要なことは、自分が学んでいることを愛することだ。",
    author: "ヨハン・ヴォルフガング・フォン・ゲーテ"
  },
  {
    text: "人生で最も難しいことは自分を知ることだ。",
    author: "タレス"
  },
  {
    text: "経験とは、誰もが自分の失敗につける名前のことである。",
    author: "オスカー・ワイルド"
  },
  {
    text: "今日の準備は昨日までに、明日の準備は今日までに。",
    author: "イチロー"
  },
  {
    text: "人生とは学校である。そこでは、幸福よりも不幸の方が良い教師である。",
    author: "フリーデル"
  },
  {
    text: "集中と根気、そして時間を惜しまないこと、これが成功への道のりである。",
    author: "アルバート・ハバード"
  },
  {
    text: "成功したければ、成功するまでやり続けることだ。",
    author: "アンドリュー・カーネギー"
  },
  {
    text: "人生の目標は学ぶことではない。生きることだ。しかし学習なくして生きることはできない。",
    author: "マルコ・アウレリウス"
  },
  {
    text: "知識と経験なくして、創造性はありえない。",
    author: "デイヴィッド・オグルビー"
  },
  {
    text: "私たちが恐れる必要があるのは、恐れること自体なのだ。",
    author: "フランクリン・D・ルーズベルト"
  },
  {
    text: "やったことは例え失敗しても、20年後には笑い話にできる。しかし、やらなかったことは、20年後には後悔するだけだ。",
    author: "マーク・トウェイン"
  },
  {
    text: "成功する人は、失敗から学び、また別の方法で挑戦する人のことだ。",
    author: "デール・カーネギー"
  },
  {
    text: "本当の学習は、学校を出てから始まる。",
    author: "T・S・エリオット"
  },
  {
    text: "学習は苦しみを通じてもたらされる。",
    author: "アイスキュロス"
  },
  {
    text: "知識は力である。しかし、より重要なのは、学習への欲求である。",
    author: "ナポレオン・ヒル"
  },
  {
    text: "読書の時間を見つけられない人は、読書への意志を見つけられない人だ。",
    author: "ヘンリー・ワード・ビーチャー"
  },
  {
    text: "学習に近道はない。",
    author: "プルーデンス"
  },
  {
    text: "すべての学習において、熱意がなければならない。",
    author: "ジョン・F・ケネディ"
  },
  {
    text: "時間があると思うな。時間は作るものだ。",
    author: "坂本龍馬"
  },
  {
    text: "人生は、今日という日の積み重ねでしかない。",
    author: "稲盛和夫"
  },
  {
    text: "他人と比較してものを考える習慣は、致命的な習慣である。",
    author: "バートランド・ラッセル"
  },
  {
    text: "学習への最大の障壁は、自分はもう十分知っているという思い込みである。",
    author: "バーナード・ショー"
  },
  {
    text: "何かを学ぶのに、その道の専門家である必要はない。必要なのは情熱だけだ。",
    author: "ビル・ナイ"
  },
  {
    text: "教育の目的は、事実を学ぶことではなく、考える方法を学ぶことである。",
    author: "アルベルト・アインシュタイン"
  },
  {
    text: "失敗は成功のもと。",
    author: "トーマス・H・ハクスリー"
  },
  {
    text: "明日は今日より良くなる。なぜなら、私たちは今日学んだからだ。",
    author: "ラルフ・ワルド・エマーソン"
  },
  {
    text: "人は一生のうち逢うべき人には必ず逢える。しかも一瞬早すぎず、一瞬遅すぎない時に。",
    author: "森信三"
  },
  {
    text: "夢なき者に成功なし。",
    author: "吉田松陰"
  },
  {
    text: "学習することは決して無駄にはならない。それは今日ではなく、明日あなたの糧となる。",
    author: "コリン・パウエル"
  },
  {
    text: "人生最大の幸福は一家の和楽である。最大の不幸は自分の我がままである。",
    author: "福澤諭吉"
  },
  {
    text: "何かを始めるのに遅すぎるということはない。",
    author: "ベンジャミン・フランクリン"
  },
  {
    text: "真の学習は、教えることから生まれる。",
    author: "古代ローマの格言"
  },
  {
    text: "現在が未来を決定する。",
    author: "マハトマ・ガンディー"
  },
  {
    text: "行動を起こすことで不安は解消される。",
    author: "デール・カーネギー"
  },
  {
    text: "成功は準備と機会が出会うところに生まれる。",
    author: "ボビー・アンサー"
  },
  {
    text: "学習は光であり、無知は闇である。",
    author: "古代インドの格言"
  },
  {
    text: "今日学んだことを明日忘れても、学ぶという行為があなたを変えている。",
    author: "マルカム・フォーブス"
  },
  {
    text: "知識は宝物だが、実践がその鍵である。",
    author: "ラオ・ツー"
  },
  {
    text: "一歩ずつでも前進すれば、必ず目標に到達できる。",
    author: "オプラ・ウィンフリー"
  },
  {
    text: "学問は石火の機に会して取るべし。",
    author: "吉田松陰"
  },
  {
    text: "実るほど頭を垂れる稲穂かな。",
    author: "日本の格言"
  },
  {
    text: "学習の美しさは、だれもあなたからそれを奪うことができないところにある。",
    author: "B.B.キング"
  },
  {
    text: "教育とは、学校で学んだことをすべて忘れてしまった後に残るものである。",
    author: "アルベルト・アインシュタイン"
  },
  {
    text: "人は皆、自分の可能性を実現するために生まれてきた。",
    author: "カール・ユング"
  },
  {
    text: "変化を嫌う心が学習を妨げる最大の敵である。",
    author: "エリック・ホッファー"
  },
  {
    text: "学習とは、知らないことを知ることではなく、知っていることを深めることである。",
    author: "タゴール"
  },
  {
    text: "人生で学んだ全てのことが将来どこかで繋がる。",
    author: "スティーブ・ジョブズ"
  },
  {
    text: "学習する意欲さえあれば、すべては教師となる。",
    author: "コルネイユ"
  },
  {
    text: "努力した者が全て報われるとは限らん。しかし、成功した者は皆すべからく努力しておる。",
    author: "はじめの一歩・鴨川会長"
  },
  {
    text: "継続は力なり。小さな努力も積み重ねれば大きな力となる。",
    author: "住岡夜香"
  },
  {
    text: "人生における失敗者の多くは、諦めた時にどれだけ成功に近づいていたかに気づかなかった人たちである。",
    author: "トーマス・エジソン"
  },
  {
    text: "今この瞬間が、あなたの人生で最も若い瞬間である。",
    author: "現代の格言"
  },
  {
    text: "教養とは、知っていることをひけらかさないことだ。",
    author: "アーネスト・ヘミングウェイ"
  },
  {
    text: "真の教育は暗記ではなく思考力を育てることにある。",
    author: "ジョン・デューイ"
  },
  {
    text: "学習に終わりはない。終わりがあるとすれば、それは生涯の終わりである。",
    author: "中国の格言"
  },
  {
    text: "知識を得ることは良いことだが、それを活用することはもっと良いことだ。",
    author: "中国の古典"
  },
  {
    text: "師匠は扉を開くが、あなた自身で中に入らなければならない。",
    author: "中国の格言"
  },
  {
    text: "学習者であり続けよう。学習者でなくなった時、あなたは成長を止める。",
    author: "現代の教育哲学"
  },
  {
    text: "知恵は知識の娘である。",
    author: "ドイツの格言"
  },
  {
    text: "一日一歩、三日で三歩、三歩進んで二歩下がる。",
    author: "津軽海峡冬景色・作詞家の心境"
  },
  {
    text: "学習は若者にとって美しさを、老人にとって慰めを、貧者にとって富を、富者にとって飾りをもたらす。",
    author: "ディオゲネス"
  },
  {
    text: "知識人とは、複雑なことを簡単に説明できる人のことである。",
    author: "現代の定義"
  },
  {
    text: "学習への熱意は年齢とともに衰えるものではない。むしろ深まるものである。",
    author: "現代の教育観"
  }
]

const DailyQuote = () => {
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    return motivationalQuotes[randomIndex]
  }

  const refreshQuote = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setQuote(getRandomQuote())
      setIsRefreshing(false)
    }, 300)
  }

  useEffect(() => {
    // Set client flag to prevent hydration mismatch
    setIsClient(true)

    // Get quote based on today's date for consistency
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem('dailyQuoteDate')
    const savedQuote = localStorage.getItem('dailyQuote')

    if (savedDate === today && savedQuote) {
      setQuote(JSON.parse(savedQuote))
    } else {
      const todaysQuote = getRandomQuote()
      setQuote(todaysQuote)
      localStorage.setItem('dailyQuoteDate', today)
      localStorage.setItem('dailyQuote', JSON.stringify(todaysQuote))
    }
  }, [])

  // Prevent hydration mismatch by not rendering dynamic content on server
  if (!isClient) {
    return (
      <Card className="mb-8 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <Quote className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  今日の一言
                </h3>
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 text-lg italic leading-relaxed mb-3">
                "読み込み中..."
              </blockquote>
              <cite className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                —
              </cite>
            </div>
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="ml-4 flex-shrink-0"
              title="新しい名言を表示"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Quote className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                今日の一言
              </h3>
            </div>
            <blockquote className="text-gray-700 dark:text-gray-300 text-lg italic leading-relaxed mb-3">
              "{quote.text}"
            </blockquote>
            <cite className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              — {quote.author}
            </cite>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshQuote}
            disabled={isRefreshing}
            className="ml-4 flex-shrink-0"
            title="新しい名言を表示"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DailyQuote