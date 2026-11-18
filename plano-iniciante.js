// Plano iniciante, 4 dias por semana, com baixo impacto em joelho e ombro.
// Compartilhado pelos apps da mae, do pai (e depois de outras pessoas). Cada pasta define PROFILE antes.
// Nenhuma informacao de saude pessoal fica neste arquivo: so exercicios e cuidados gerais.
const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const PROGRAM_WEEKS = 8;
const WEEKDAY_PLAN = { 0: null, 1: 'FA', 2: 'CA', 3: null, 4: 'FB', 5: null, 6: 'CB' };
const OPT = (typeof PROFILE !== 'undefined' && PROFILE.opts) || {};

PROFILE.avisos = [
  'Comece só depois da liberação do seu médico para fazer exercício.',
  'Respire sempre: solte o ar quando fizer força. Nunca prenda a respiração.',
  'Levante-se devagar entre os exercícios, para não ter tontura.',
  'Pare o treino e procure o seu médico se sentir dor no peito, falta de ar fora do normal, batedeira (palpitação), tontura ou mal-estar.',
  'Não treine se estiver com mal-estar, febre ou se o médico orientou esperar.',
  'Esforço certo: dá para falar uma frase inteira durante o exercício. Nunca vá até o limite.',
  'Dor na articulação: até 3 de 10 pode continuar. De 4 a 5, diminua a carga e o tamanho do movimento. Acima disso, ou se for uma dor aguda, pare o exercício.',
  'Ombro e joelho: movimentos curtos e sem dor. Nada de braço acima da cabeça com peso, nem agachamento fundo.',
  'Beba água antes, durante e depois.'
];

const aquec = { n: 'Aquecimento: bicicleta leve', unit: 'min', sets: 1, reps: '5-8', rest: 0, img: 'Bicycling_Stationary', yt: 'aquecimento bicicleta ergométrica',
  cues: ['Banco alto: o joelho fica quase esticado lá embaixo.', 'Carga baixíssima, ritmo de conversa.', 'Dá para fazer em qualquer bicicleta da academia.'] };

const legPress = { n: 'Leg press, movimento curto', sets: 2, reps: '10-15', rest: 120, img: 'Leg_Press', yt: 'leg press como fazer iniciante',
  cues: ['Costas coladas no encosto.', 'Dobre o joelho só até onde não dói (no máximo 90°).', 'Empurre devagar e não estique o joelho de uma vez.', 'Solte o ar ao empurrar.'] };

const PLAN = {
  FA: { name: 'Força A', tag: 'Corpo inteiro', ex: [
    aquec,
    { n: 'Sentar e levantar do banco', sets: 2, reps: '10-12', rest: 90, img: 'Chair_Squat', yt: 'sentar e levantar da cadeira exercício idosos',
      cues: ['Use um banco mais alto que o joelho e apoie as mãos se precisar.', 'Desça só até onde não sentir dor.', 'Solte o ar ao levantar.', 'Joelhos na direção dos pés.'] },
    { n: 'Mesa flexora (parte de trás da coxa)', sets: 2, reps: '10-15', rest: 90, img: 'Lying_Leg_Curls', yt: 'mesa flexora execução correta',
      cues: ['Carga bem leve, movimento devagar.', 'Quadril colado no banco.', 'Volte devagar, sem soltar o peso.'] },
    { n: 'Supino na máquina, pegada neutra', sets: 2, reps: '10-15', rest: 90, img: 'Machine_Bench_Press', yt: 'supino máquina peitoral como fazer',
      cues: ['Costas no encosto, ombros para baixo e para trás.', 'Os cotovelos não passam da linha do corpo.', 'Se o ombro incomodar, troque pela flexão na parede.'] },
    { n: 'Remada sentada na polia', sets: 2, reps: '10-15', rest: 90, img: 'Seated_Cable_Rows', yt: 'remada baixa na polia execução correta',
      cues: ['Peito aberto, coluna reta.', 'Puxe até o cotovelo encostar no corpo, sem ir além.', 'Volte devagar.'] },
    { n: 'Rotação externa do ombro (polia ou elástico)', sets: 2, reps: '12-15', rest: 60, img: 'External_Rotation_with_Cable', yt: 'rotação externa ombro elástico exercício',
      cues: ['Cotovelo colado no corpo, dobrado a 90°.', 'Carga bem leve: é para fortalecer o ombro, não para cansar.', 'Gire para fora devagar e volte devagar.'] },
    { n: 'Elevação do quadril no chão', sets: 2, reps: '10-12', rest: 60, img: 'Butt_Lift_Bridge', yt: 'elevação pélvica no chão ponte glúteo',
      cues: ['Deitado, joelhos dobrados e pés no chão.', 'Suba o quadril apertando o bumbum.', 'Solte o ar ao subir e desça devagar.'] },
    { n: 'Panturrilha sentado', sets: 2, reps: '12-15', rest: 60, img: 'Seated_Calf_Raise', yt: 'panturrilha sentado execução correta',
      cues: ['Suba e segure 1 segundo.', 'Desça devagar, sem quicar.'] },
    { n: 'Dead bug (deitado, braços e pernas alternados)', sets: 2, reps: '8-10', rest: 60, img: 'Dead_Bug', yt: 'dead bug exercício abdominal iniciante',
      cues: ['Deitado de costas, joelhos dobrados no ar.', 'Estique um braço e a perna do lado oposto, devagar.', 'Lombar encostada no chão; solte o ar ao esticar.'] }
  ]},
  CA: { name: 'Aeróbico A', tag: 'Leve e mobilidade', ex: [
    { n: 'Bicicleta ou caminhada na esteira', unit: 'min', sets: 1, reps: '15-25', rest: 0, img: 'Bicycling_Stationary', yt: 'bicicleta ergométrica como regular banco',
      cues: ['Ritmo em que você consegue conversar.', 'Banco alto, carga baixa.', 'Na esteira: sem inclinação e sem correr.', 'Se sentir qualquer desconforto no peito ou tontura, pare.'] },
    { n: 'Mobilidade do ombro e alongamento suave', unit: 'min', sets: 1, reps: '5-8', rest: 0, img: 'Chair_Upper_Body_Stretch', yt: 'pêndulo ombro exercício mobilidade',
      cues: ['Pêndulo: incline o tronco apoiando a mão boa e balance o braço solto, em círculos pequenos.', 'Círculos suaves com os ombros para trás.', 'Alongue sem dor, sem forçar.'] }
  ]},
  FB: { name: 'Força B', tag: 'Corpo inteiro', ex: [
    aquec,
    ...(OPT.legPress ? [legPress] : []),
    { n: 'Cadeira abdutora', sets: 2, reps: '12-15', rest: 60, img: 'Thigh_Abductor', yt: 'cadeira abdutora execução correta',
      cues: ['Costas no encosto.', 'Abra as pernas devagar, sem impulso.', 'Carga leve: estabiliza o joelho.'] },
    { n: 'Mesa flexora sentado', sets: 2, reps: '10-15', rest: 90, img: 'Seated_Leg_Curl', yt: 'cadeira flexora sentado execução correta',
      cues: ['Carga leve.', 'Dobre os joelhos devagar e volte devagar.'] },
    { n: 'Remada na máquina com apoio no peito', sets: 2, reps: '10-15', rest: 90, img: 'Leverage_Iso_Row', yt: 'remada máquina apoio no peito execução',
      cues: ['Peito apoiado, ombros para baixo.', 'Puxe levando os cotovelos para trás, sem passar do corpo.', 'Volte devagar.'] },
    { n: 'Puxada na frente, pegada neutra', sets: 2, reps: '10-15', rest: 90, img: 'Close-Grip_Front_Lat_Pulldown', yt: 'puxada na frente pegada neutra triângulo',
      cues: ['Puxe até a altura do queixo. Nunca atrás da nuca.', 'Cotovelos para baixo e perto do corpo.', 'Se o ombro doer, troque por mais uma remada.'] },
    { n: 'Face pull leve (polia ou elástico)', sets: 2, reps: '12-15', rest: 60, img: 'Face_Pull', yt: 'face pull polia como fazer',
      cues: ['Carga mínima.', 'Puxe a corda em direção ao rosto, abrindo os cotovelos.', 'Só até onde o ombro estiver confortável.'] },
    { n: 'Flexão na parede', sets: 2, reps: '8-12', rest: 60, img: 'Incline_Push-Up', yt: 'flexão na parede como fazer',
      cues: ['Mãos na parede, na altura do peito.', 'Corpo em linha reta, a uns 40 cm da parede.', 'Dobre os cotovelos devagar e empurre de volta.'] },
    { n: 'Panturrilha em pé, com apoio das mãos', sets: 2, reps: '12-15', rest: 60, img: 'Standing_Calf_Raises', yt: 'panturrilha em pé com apoio',
      cues: ['Apoie as mãos para ter equilíbrio.', 'Suba na ponta dos pés e desça devagar.'] },
    { n: 'Abdominal curto', sets: 2, reps: '8-10', rest: 60, img: 'Crunches', yt: 'abdominal curto crunch iniciante',
      cues: ['Deitado, joelhos dobrados.', 'Só a cabeça e os ombros saem do chão.', 'Solte o ar ao subir. Sem puxar o pescoço.'] }
  ]},
  CB: { name: 'Aeróbico B', tag: 'Leve e equilíbrio', ex: [
    { n: 'Caminhada na esteira ou bicicleta', unit: 'min', sets: 1, reps: '15-25', rest: 0, img: 'Walking_Treadmill', yt: 'caminhada na esteira postura correta',
      cues: ['Ritmo de conversa, sem inclinação.', 'Passos naturais e postura ereta, sem se segurar forte nas barras.', 'Se sentir desconforto no peito ou tontura, pare.'] },
    { n: 'Equilíbrio em pé, com apoio por perto', unit: 'min', sets: 1, reps: '5-8', rest: 0, img: '', yt: 'exercícios de equilíbrio idosos em pé',
      cues: ['Fique perto de uma barra ou parede, sem segurar com força.', 'Passe o peso de um pé para o outro, devagar.', 'Ficar em pé com os pés juntos por 30 segundos, 2 a 3 vezes.', 'Sempre com apoio ao alcance das mãos.'] }
  ]}
};

// séries: aeróbico sempre 1; força começa com 1 série e passa a 2 na semana 3
function setsFor(ex, wk) { return ex.unit === 'min' ? 1 : (wk <= 2 ? 1 : (ex.sets || 2)); }

function phaseInfo(wk) {
  if (wk <= 2) return { name: 'Adaptação', warn: true, tip: '1 série de cada, carga bem leve. O objetivo é aprender os movimentos, sem cansar.' };
  if (wk <= 4) return { name: 'Construindo a base', tip: '2 séries de cada, esforço leve. Aumente só se estiver fácil e sem dor.' };
  if (wk <= PROGRAM_WEEKS) return { name: 'Progressão', tip: 'Quando as 15 repetições ficarem fáceis, suba um pouquinho a carga na semana seguinte.' };
  return { name: 'Fim do ciclo', warn: true, tip: 'Hora de rever o plano com o médico ou fisioterapeuta antes de seguir.' };
}
