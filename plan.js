// Plano Upper/Lower 4x. "img" = pasta do exercício em yuhonas/free-exercise-db (imagens 0.jpg e 1.jpg).
// "yt" = termo de busca no YouTube (resultados em português).
const START_DATE = '2026-11-10';
const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const WEEKDAY_PLAN = { 0: null, 1: null, 2: 'UA', 3: 'LA', 4: null, 5: 'UB', 6: 'LB' };

const PLAN = {
  UA: { name: 'Upper A', tag: 'Superior · força', ex: [
    { n: 'Supino reto (barra ou halteres)', sets: 3, reps: '8', rest: 150, img: 'Barbell_Bench_Press_-_Medium_Grip', yt: 'supino reto com barra execução correta',
      cues: ['Escápulas juntas e para baixo, pés firmes no chão.', 'Desça a barra até a linha do peito, cotovelos a ~45° do tronco.', 'Empurre sem tirar o quadril do banco.'] },
    { n: 'Remada curvada ou máquina', sets: 3, reps: '8', rest: 150, img: 'Bent_Over_Barbell_Row', yt: 'remada curvada com barra execução correta',
      cues: ['Tronco inclinado, coluna neutra, joelhos levemente flexionados.', 'Puxe a barra em direção ao umbigo, cotovelos para trás.', 'Controle a descida, sem balançar o tronco.'] },
    { n: 'Desenvolvimento com halteres', sets: 3, reps: '10', rest: 120, img: 'Dumbbell_Shoulder_Press', yt: 'desenvolvimento com halteres execução correta',
      cues: ['Sentado com o encosto firme, abdômen contraído.', 'Halteres na altura das orelhas, antebraços na vertical.', 'Suba sem arquear a lombar.'] },
    { n: 'Puxada na frente', sets: 3, reps: '10', rest: 120, img: 'Wide-Grip_Lat_Pulldown', yt: 'puxada na frente polia alta execução correta',
      cues: ['Peito aberto, leve inclinação para trás.', 'Puxe a barra até a altura do queixo, cotovelos para baixo.', 'Suba devagar até esticar os braços.'] },
    { n: 'Tríceps na polia', sets: 2, reps: '12', rest: 75, img: 'Triceps_Pushdown', yt: 'tríceps pulley polia execução correta',
      cues: ['Cotovelos colados ao corpo e parados.', 'Estenda os braços por completo embaixo.', 'Volte até 90° sem levantar os ombros.'] },
    { n: 'Rosca direta', sets: 2, reps: '12', rest: 75, img: 'Barbell_Curl', yt: 'rosca direta com barra execução correta',
      cues: ['Cotovelos fixos ao lado do corpo.', 'Suba sem balançar o tronco.', 'Desça controlando por 2 a 3 segundos.'] }
  ]},
  LA: { name: 'Lower A', tag: 'Inferior · força', ex: [
    { n: 'Agachamento (livre ou smith)', sets: 3, reps: '8', rest: 150, img: 'Barbell_Full_Squat', yt: 'agachamento livre com barra execução correta',
      cues: ['Pés na largura dos ombros, pontas levemente abertas.', 'Joelhos seguem a direção dos pés, tronco firme.', 'Desça até pelo menos a paralela e suba empurrando o chão.'] },
    { n: 'Stiff / romeno', sets: 3, reps: '10', rest: 120, img: 'Stiff-Legged_Barbell_Deadlift', yt: 'stiff com barra execução correta',
      cues: ['Joelhos quase retos, quadril vai para trás.', 'Barra rente às pernas, coluna neutra.', 'Desça até sentir o posterior esticar e volte contraindo o glúteo.'] },
    { n: 'Leg press', sets: 3, reps: '12', rest: 120, img: 'Leg_Press', yt: 'leg press 45 execução correta',
      cues: ['Lombar e quadril colados no encosto.', 'Pés na largura dos ombros, no meio da plataforma.', 'Não trave os joelhos no topo.'] },
    { n: 'Mesa flexora', sets: 3, reps: '12', rest: 90, img: 'Lying_Leg_Curls', yt: 'mesa flexora execução correta',
      cues: ['Quadril colado no banco.', 'Flexione os joelhos sem levantar o quadril.', 'Volte devagar, sem soltar o peso.'] },
    { n: 'Panturrilha em pé', sets: 4, reps: '12', rest: 60, img: 'Standing_Calf_Raises', yt: 'panturrilha em pé execução correta',
      cues: ['Suba o máximo que conseguir e segure 1 segundo.', 'Desça até alongar bem o calcanhar.', 'Movimento lento, sem quicar.'] },
    { n: 'Prancha', sets: 3, reps: '30-40', unit: 's', rest: 60, img: 'Plank', yt: 'prancha abdominal execução correta',
      cues: ['Cotovelos sob os ombros, corpo em linha reta.', 'Contraia abdômen e glúteos.', 'Não deixe o quadril cair nem subir.'] }
  ]},
  UB: { name: 'Upper B', tag: 'Superior · volume', ex: [
    { n: 'Supino inclinado com halteres', sets: 3, reps: '10', rest: 120, img: 'Incline_Dumbbell_Press', yt: 'supino inclinado com halteres execução correta',
      cues: ['Banco a 30-45°, escápulas fixas.', 'Desça até alongar o peito, cotovelos a ~45°.', 'Suba juntando os halteres sem bater um no outro.'] },
    { n: 'Remada baixa ou unilateral', sets: 3, reps: '10', rest: 120, img: 'Seated_Cable_Rows', yt: 'remada baixa na polia execução correta',
      cues: ['Peito aberto, coluna reta.', 'Puxe levando os cotovelos para trás do corpo.', 'Segure 1 segundo e volte devagar.'] },
    { n: 'Elevação lateral', sets: 3, reps: '15', rest: 60, img: 'Side_Lateral_Raise', yt: 'elevação lateral execução correta',
      cues: ['Carga leve, cotovelos levemente flexionados.', 'Suba até a altura dos ombros, sem balançar.', 'Desça controlando.'] },
    { n: 'Crucifixo / peck deck', sets: 3, reps: '12', rest: 90, img: 'Butterfly', yt: 'peck deck voador execução correta',
      cues: ['Costas coladas no encosto, ombros para baixo.', 'Junte os braços à frente contraindo o peito.', 'Volte até alongar, sem passar da linha do corpo.'] },
    { n: 'Puxada neutra / barra assistida', sets: 3, reps: '10', rest: 120, img: 'Close-Grip_Front_Lat_Pulldown', yt: 'puxada pegada neutra triângulo execução correta',
      cues: ['Peito para frente, escápulas para baixo.', 'Leve o triângulo ao peito, cotovelos junto ao corpo.', 'Controle a subida.'] },
    { n: 'Rosca martelo', sets: 2, reps: '12', rest: 60, img: 'Hammer_Curls', yt: 'rosca martelo execução correta',
      cues: ['Palmas voltadas uma para a outra.', 'Cotovelos fixos ao lado do corpo.', 'Sem balançar o tronco.'] },
    { n: 'Tríceps testa / francês', sets: 2, reps: '12', rest: 60, img: 'EZ-Bar_Skullcrusher', yt: 'tríceps testa execução correta',
      cues: ['Cotovelos apontando para o teto e parados.', 'Desça a barra até a testa ou logo atrás da cabeça.', 'Estenda sem abrir os cotovelos.'] }
  ]},
  LB: { name: 'Lower B', tag: 'Inferior · volume', ex: [
    { n: 'Leg press 45° ou hack', sets: 3, reps: '10', rest: 150, img: 'Hack_Squat', yt: 'agachamento hack máquina execução correta',
      cues: ['Costas coladas no encosto.', 'Desça até ~90° ou mais, joelhos alinhados com os pés.', 'Suba empurrando com o meio do pé.'] },
    { n: 'Passada / afundo (por perna)', sets: 3, reps: '10', rest: 120, img: 'Dumbbell_Lunges', yt: 'afundo com halteres execução correta',
      cues: ['Passo largo, tronco ereto.', 'Joelho da frente alinhado ao pé, joelho de trás quase toca o chão.', 'Empurre pelo calcanhar da frente para voltar.'] },
    { n: 'Cadeira extensora', sets: 3, reps: '12', rest: 90, img: 'Leg_Extensions', yt: 'cadeira extensora execução correta',
      cues: ['Eixo da máquina alinhado ao joelho.', 'Estenda sem balançar e segure 1 segundo no topo.', 'Desça devagar.'] },
    { n: 'Elevação pélvica', sets: 3, reps: '10', rest: 120, img: 'Barbell_Hip_Thrust', yt: 'elevação pélvica hip thrust execução correta',
      cues: ['Escápulas apoiadas no banco, pés firmes.', 'Suba o quadril até alinhar com joelho e ombro.', 'Contraia o glúteo no topo, queixo levemente recolhido.'] },
    { n: 'Cadeira abdutora', sets: 2, reps: '15', rest: 60, img: 'Thigh_Abductor', yt: 'cadeira abdutora execução correta',
      cues: ['Costas no encosto.', 'Abra as pernas sem usar impulso.', 'Volte devagar sem encostar os pesos.'] },
    { n: 'Panturrilha sentado', sets: 4, reps: '15', rest: 60, img: 'Seated_Calf_Raise', yt: 'panturrilha sentado execução correta',
      cues: ['Suba o máximo e segure 1 segundo.', 'Desça alongando bem.', 'Sem quicar.'] },
    { n: 'Abdominal na polia', sets: 3, reps: '12', rest: 60, img: 'Cable_Crunch', yt: 'abdominal na polia alta execução correta',
      cues: ['Ajoelhado, corda junto à cabeça.', 'Encolha o tronco levando as costelas ao quadril.', 'Não puxe com os braços.'] }
  ]}
};
